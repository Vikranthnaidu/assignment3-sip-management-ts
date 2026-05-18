import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const client = new Pool({
  host: "aws-1-ap-south-1.pooler.supabase.com",
  port: 6543,
  user: "postgres.cwfwwkqfuubtysbpkpfh",
  password: process.env.PASSWORD as string,
  database: "postgres",
  max:50,
  ssl: {
    rejectUnauthorized: false,
  },
});

const run = async (): Promise<void> => {

  try {

    await client.connect();

    console.log("Connected to PostgreSQL Database");

  } catch (error) {

    console.log(error);

  }
};

run();

export default client;