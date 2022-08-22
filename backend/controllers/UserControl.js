import User from "../models/UserModel.js";
import { Op } from "sequelize"; // library operator

export const getUsers = async (req, res) => {
  /*
      * parseInt() = convert ke integer
    
      ? deklarasi query parameter by ID TERKAHIR YG DITAMPILKAN berisi integer
      ! req.query.lastId = berisi string
      ! || 0 = jika user tidak mengirim query page  */
  const last_id = parseInt(req.query.lastId) || 0;

  /*
      ? deklarasi query parameter BATAS DATA YG DITAMPILKAN berisi integer
      ! req.query.limit = berisi string
      ! || 10 = jika user tidak mengirim query page  */
  const limit = parseInt(req.query.limit) || 10;

  /*
      ? deklarasi query parameter PENCARIAN KATA KUNCI YG DITAMPILKAN berisi string
      ! req.query.limit = berisi string
      ! || 10 = jika user tidak mengirim query page  */
  const search = req.query.search_query || "";

  // deklarasi hasil yg berisi array
  let result = [];

  if (last_id < 1) {
    const datas = await User.findAll({
      where: {
        // deklarasi operator dengan or
        [Op.or]: [
          {
            name: {
              // deklarasi operaator dengan pencarian serupa
              // ! "%" = pencarian kata depan atau belakang
              [Op.like]: "%" + search + "%",
            },
          },
          {
            email: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
      limit: limit, // query limit
      order: [["id", "DESC"]], // query order by id secara descending
    });
    result = datas; // hasil pencarian by last id
  } else {
    const datas2 = await User.findAll({
      where: {
        id: {
          // deklarasi operator dengan less then (kurang dari)
          [Op.lt]: last_id,
        },
        [Op.or]: [
          {
            name: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            email: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
      limit: limit,
      order: [["id", "DESC"]],
    });
    result = datas2;
  }

  res.json({
    // hasil pencarian diambil dari variabel array result
    result: result,
    //hasil last id diambil dari pengecekan id terakhir dari result
    lastId: result.length ? result[result.length - 1].id : 0,
    // melihat sisa data
    hasMore: result.length >= limit ? true : false,
  });
};
