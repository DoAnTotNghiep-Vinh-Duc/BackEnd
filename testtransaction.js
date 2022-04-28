(async function () {
  // Connect
  const { MongoClient } = require("mongodb");
  const uri = "mongodb://localhost:27017/dbfour?" + "replicaSet=rs";
  const client = await MongoClient.connect(uri, { useNewUrlParser: true });

  const db = client.db();
  await db.dropDatabase();
  console.log("(1) Xoá hết database nếu tồn tại \n");

  // Tạ dữ liệu cho hai tài khoản
  await db.collection("Account").insertMany([
    { name: "A", balance: 50 },
    { name: "B", balance: 10 },
  ]);
  console.log(
    "(2) Thực hiện insertMany,  Tài khoản Anonystick có 50 đồng, Tài khoản B  có 10 đồng\n"
  );

  await transfer("A", "B", 10); // lần 1
  console.log("(3) Sau đó Anonystick chuyển tiền cho B 10 đồng\n");

  try {
    // test chuyển tiền sô dư không đủ
    console.log("(4) Anonystick lại chuyển tiền cho B 50\n");
    await transfer("A", "B", 50);
  } catch (error) {
    //error.message; // "Không đủ tiền: 40"
    console.log(error.message);
    console.log(
      "\n(5) Thông báo cho tài khoản anonystick - Số dư không đủ nên thao tác chuyển này không thành công"
    );
  }

  // Lệnh chuyển tiền
  async function transfer(from, to, amount) {
    const session = client.startSession();
    session.startTransaction();
    try {
      const opts = { session, returnOriginal: false };
      const A = await db
        .collection("Account")
        .findOneAndUpdate({ name: from }, { $inc: { balance: -amount } }, opts)
        .then((res) => res.value);
      console.log("A>>>A", A);
      if (A.balance < 0) {
        // Nếu số dư của Anonystick không đủ, việc chuyển tiền không thành công và giao dịch bị hủy bỏ
        // `session.abortTransaction()` có nhiềm vụ Sẽ hoàn tác thao tác `findOneAndUpdate () 'ở trên

        //select lại lần nữa?
        console.log(await db.collection("Account").findOne({ name: from }));
        throw new Error("Không đủ tiền: " + (A.balance + amount));
      }

      const B = await db
        .collection("Account")
        .findOneAndUpdate({ name: to }, { $inc: { balance: amount } }, opts)
        .then((res) => res.value);

      await session.commitTransaction();
      session.endSession();
      return { from: A, to: B };
    } catch (error) {
      // Nếu xảy ra lỗi, hãy hủy bỏ tất cả các giao dịch và quay trở lại trước khi sửa đổi
      console.log("Loi ne");
      await session.abortTransaction();
      session.endSession();
      throw error; // catch error
    }
  }
})();
