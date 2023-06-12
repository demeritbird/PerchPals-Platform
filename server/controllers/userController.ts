import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import sharp from 'sharp';

import * as factory from './handlerFactory';
import { User } from './../models';
import { UserRequest } from './../utils/types';
import { AppError, catchAsync } from '../utils/helpers';

export const getAllUsers = factory.getAll(User);
export const getUser = factory.getOne(User);
export const updateUser = factory.updateOne(User);
export const deleteUser = factory.deleteOne(User);

export const getMe = catchAsync(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError('No document found with that ID', 404));
    req.params.id = req.user!._id.toString();

    next();
  }
);

const multerStorage = multer.memoryStorage();

const multerFilter = (req: Request, file: Express.Multer.File, callback: Function) => {
  if (file.mimetype.startsWith('image')) {
    callback(null, true);
  } else {
    callback(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadUserPhoto = upload.single('photo');

const filterObj = (obj: Record<string, any>, ...allowedFields: string[]) => {
  const newObj: Record<string, any> = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

export const resizeUserPhoto = catchAsync(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    if (!req.file) return next();

    req.file.filename = `user-${req.user?.id}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`storage/img/${req.file.filename}`);

    next();
  }
);

export const updateMe = catchAsync(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    console.log(req.file);
    console.log(req.body);

    const filteredBody = filterObj(req.body);
    if (req.file) filteredBody.photo = req.file.filename;

    console.log(filteredBody);

    /* TODO: Change User Information 
    const updatedUser = await User.findByIdAndUpdate(req.user!.id, filteredBody, {
      new: true,
      runValidators: true,
    });
    */
    res.status(200).json({
      status: 'success',
      // data: {
      //   user: updatedUser,
      // },
    });
  }
);
