import client from "../utils/pgManager";

interface FundData {
  id: string;
  name: string;
  amc_name: string;
  current_nav: number;
}

const createFund = async (
  data: FundData
): Promise<any> => {

  const query = `
    INSERT INTO mf_details(
      id,
      name,
      amc_name,
      current_nav
    )
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  const values = [
    data.id,
    data.name,
    data.amc_name,
    data.current_nav,
  ];

  const result = await client.query(query, values);

  return result.rows[0];
};

const getAllFunds = async (): Promise<any[]> => {

  const query = `
    SELECT * FROM mf_details
  `;

  const result = await client.query(query);

  return result.rows;
};

const updateNAV = async (
  fundId: string,
  current_nav: number
): Promise<any> => {

  const query = `
    UPDATE mf_details
    SET current_nav = $1
    WHERE id = $2
    RETURNING *;
  `;

  const result = await client.query(query, [
    current_nav,
    fundId,
  ]);

  return result.rows[0];
};

export {
  createFund,
  getAllFunds,
  updateNAV,
};