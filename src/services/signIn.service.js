const throwError = require("../helpers/error.helper");
const AccountService = require("../services/account.service");
const ServicesService = require("../services/services.service");
const admin = require("firebase-admin");
const { db } = require("../config/connection.config");
const Users = db.collection("Users");

class SignInService {
  static async addUser(data) {
    const { fullName, id, idPhoto, incomeSource, email, password } = data;

    await Users.add({ fullName, id, idPhoto, incomeSource, email, password })
      .then((docRef) => {
        const accountCRC = {
          owner: docRef.id,
          currency: "₡",
          balance: 0,
          code: "CR",
        };
        AccountService.addAccount(accountCRC);
        const accountUSD = {
          owner: docRef.id,
          currency: "$",
          balance: 0,
          code: "US",
        };
        AccountService.addAccount(accountUSD);
        ServicesService.generateBills(id)
      })
      .catch(() => {
        throwError(500, "Database error");
      });
  }

  static async uploadImage(image) {
    const imageBuffer = new Uint8Array(image);
    let url = "";

    const options = {
      action: "read",
      expires: "03-17-2025",
    };

    const bucket = admin.storage().bucket();
    const file = bucket.file(Date.now().toString());
    await file.save(
      imageBuffer,
      {
        metadata: { contentType: "image/png" },
      },
      async (error) => {
        if (error) {
          throwError(500, "Error uploading image");
        }
        await file.getSignedUrl(options).then((results) => {
          url = results[0];
        });
      }
    );

    return url;
  }
}

module.exports = SignInService;
