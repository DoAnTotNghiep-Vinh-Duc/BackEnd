module.exports = (io: any) => {
    io.on("connection", (socket: any) => {
        if (io.req) {
            console.log("Bạn chưa đăng nhập");
            console.log("io.req.payload",io.req.payload);
            
            if (io.req.payload) {
            console.log("Kết nối socket thành công");
            }
        }
    });
  };