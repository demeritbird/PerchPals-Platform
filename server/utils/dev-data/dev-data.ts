import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import readlineSync from 'readline-sync';

import User from './../../models/userModel';
import Class from './../../models/classModel';
import Appraisal from '../../models/appraisalModel';
import { bufferConvertToString } from '../helpers';

dotenv.config({ path: __dirname + './../../.env' });
const DB: string = process.env.DATABASE!.replace('<PASSWORD>', process.env.DATABASE_PASSWORD!);
mongoose.set('strictQuery', true);
mongoose.connect(DB).then((con) => {
  console.log('DB connection successful!');
});

function createCmdPrompt(): boolean {
  const userInput: string = readlineSync
    .question('This action is irreversible! Proceed...? (y/n): ')
    .toLowerCase();

  if (userInput.match(/^(yes|y)$/gi)) return true;
  else if (userInput.match(/^(no|n)$/gi)) return false;
  else return createCmdPrompt();
}

// Read JSON file
const users = JSON.parse(
  fs.readFileSync(`${__dirname}` + `/collections/users.json`, 'utf-8')
).map((user: any) => {
  if (user.photo) {
    user.photo = bufferConvertToString(user.photo);
  }
  return user;
});
const classes = JSON.parse(
  fs.readFileSync(`${__dirname}` + `/collections/classes.json`, 'utf-8')
);
const appraisals = JSON.parse(
  fs.readFileSync(`${__dirname}` + `/collections/appraisals.json`, 'utf-8')
);

// Import Data into Collection
const importData = async (): Promise<void> => {
  try {
    const selection = createCmdPrompt();
    if (!selection) return;

    await User.create(users, { validateBeforeSave: false });
    await Class.create(classes, { validateBeforeSave: false });
    await Appraisal.create(appraisals, { validateBeforeSave: false });
    console.log('Data successfully imported!');
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
};

// Delete All Data from Collection
const deleteData = async (): Promise<void> => {
  try {
    const selection = createCmdPrompt();
    if (!selection) return;

    await User.deleteMany();
    await Class.deleteMany();
    await Appraisal.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
