// Note: chưa có gắn token verify nhé
export class MaiTemplateService {
    static async getMailTemplate(data: any, lang: string, callback: any) {
        const mailTemplate = [
        {
            lang: "en",
            template: {
                staff: {
                    subject: "You have a new  from Lemon",
                    content: `Contact name: ${data.name} <br /> Contact email: ${data.email} <br />Contact content: ${data.content}`
                },

                thankyou_customer: {
                    subject: "Thank you for getting in touch with us",
                    content: `<div
                    style="
                      width: 700px;
                      height: 500px;
                      padding: 5px 30px;
                      background-color: white;
                      border-radius: 10px;
                      box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
                      margin: 0;
                      box-sizing: border-box;
                    "
                  >
                    <div style="width: 100%; height: 20%">
                      <h1
                        style="
                          width: 100%;
                          height: 20%;
                          letter-spacing: 1px;
                          text-align: center;
                          color: #0d0e43;
                        "
                      >
                        Chào mừng đến với LEMON!
                      </h1>
                      <div style="width: 20%; height: 80%; margin: 0 auto">
                        <img
                          style="width: 50px; height: 50px"
                          src="https://img.icons8.com/clouds/100/000000/handshake.png"
                          alt=""
                        />
                      </div>
                    </div>
                    <div style="width: 100%; height: 55%">
                      <div style="text-align: left; width: 100%; color: #0d0e43">
                        Chào <b> ${data.name}, </b>
                      </div>
                      <div style="color: #0d0e43; margin-top: 10px; margin-bottom: 10px">
                        Chúng tôi rất vui mừng vì bạn đã lựa chọn chúng tôi. Chúng tôi cần
                        phải xác thực tài khoản của bạn. Vui lòng nhấn vào nút
                        <b> <i>Xác thực tài khoản</i> </b> bên dưới!
                      </div>
                      <a
                        style="
                          margin-left: 200px;
                          padding: 10px 20px;
                          background-color: #fb2e86;
                          color: white;
                          border-radius: 5px;
                          cursor: pointer;
                          text-decoration: none;
                        "
                        href="http://localhost:3000/verifyAccount/${encodeURIComponent(data.verifyCode)}"
                        target="_blank"
                      >
                        Xác thực tài khoản
                      </a>
              
                      <div style="margin-top: 10px; color: #0d0e43">
                        Nếu như có bất kì câu hỏi nào, vui lòng trả lời vào email này - chúng
                        tôi luôn sẵn sàng hỗ trợ bạn!
                      </div>
                      <div
                        style="
                          text-align: left;
                          width: 100%;
                          color: #0d0e43;
                          margin-top: 20px;
                        "
                      >
                        Trân trọng,
                      </div>
                      <div
                        style="
                          text-align: left;
                          width: 100%;
                          color: #0d0e43;
                          font-weight: bold;
                          font-size: 25px;
                          letter-spacing: 2px;
                        "
                      >
                        Lemon
                      </div>
                    </div>
                    <div
                      style="
                        width: 100%;
                        height: 25%;
                        border-top: 1px dashed #0d0e43;
                        color: #0d0e43;
                        font-size: 14px;
                      "
                    >
                      <div style="margin-bottom: 5px">
                        Hotline:
                        <a
                          href="tel:0359806602"
                          style="text-decoration: none; color: #0d0e43"
                          target="_blank"
                          >(+84) 359 806 602</a
                        >
                      </div>
                      <div style="margin-bottom: 5px">
                        Địa chỉ: 12 Nguyễn Văn Bảo, phường 5, quận Gò Vấp, TP.HCM
                      </div>
                      <div>Theo dõi chúng tôi tại:</div>
                      <div>
                        Facebook:
                        <a
                          href="https://www.facebook.com/profile.php?id=100008079398913"
                          style="text-decoration: none"
                          target="_blank"
                          >https://www.facebook.com/profile.php?id=100008079398913</a
                        >
                      </div>
                      <div>
                        Instagram:
                        <a
                          href="https://www.facebook.com/profile.php?id=100008079398913"
                          style="text-decoration: none"
                          >https://www.facebook.com/profile.php?id=100008079398913</a
                        >
                      </div>
                    </div>
                  </div>`
                }
            }
        }]

        const template = mailTemplate.find((element) => element.lang === lang)

        callback(template?.template)
    }

    static async getMailTemplateForgotPassword(data: any, lang: string, callback: any) {
      const mailTemplate = [
      {
          lang: "en",
          template: {
              staff: {
                  subject: "You have a new  from Lemon",
              },

              forgotPassword: {
                  subject: "Forgot password",
                  content: `<div
                  style="
                    width: 700px;
                    height: 500px;
                    padding: 5px 30px;
                    background-color: white;
                    border-radius: 10px;
                    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
                    margin: 0;
                    box-sizing: border-box;
                  "
                >
                  <div style="width: 100%; height: 20%">
                    <h1
                      style="
                        width: 100%;
                        height: 20%;
                        letter-spacing: 1px;
                        text-align: center;
                        color: #0d0e43;
                      "
                    >
                      Khôi phục mật khẩu LEMON!
                    </h1>
                    <div style="width: 20%; height: 80%; margin: 0 auto">
                      <img
                        style="width: 50px; height: 50px"
                        src="https://img.icons8.com/clouds/100/000000/handshake.png"
                        alt=""
                      />
                    </div>
                  </div>
                  <div style="width: 100%; height: 55%">
                    <div style="text-align: left; width: 100%; color: #0d0e43">
                    </div>
                    <div style="color: #0d0e43; margin-top: 10px; margin-bottom: 10px">
                      </div>
                      <a
                        style="
                          margin-left: 200px;
                          padding: 10px 20px;
                          background-color: #fb2e86;
                          color: white;
                          border-radius: 5px;
                          cursor: pointer;
                          text-decoration: none;
                        "
                        href="http://localhost:3000/verifyAccount/${encodeURIComponent(data.verifyCode)}"
                        target="_blank"
                      >
                        Xác thực để nhận mật khẩu mới
                      </a>
                    </div>
            
                    <div style="margin-top: 10px; color: #0d0e43">
                      Nếu như có bất kì câu hỏi nào, vui lòng trả lời vào email này - chúng
                      tôi luôn sẵn sàng hỗ trợ bạn!
                    </div>
                    <div
                      style="
                        text-align: left;
                        width: 100%;
                        color: #0d0e43;
                        margin-top: 20px;
                      "
                    >
                      Trân trọng,
                    </div>
                    <div
                      style="
                        text-align: left;
                        width: 100%;
                        color: #0d0e43;
                        font-weight: bold;
                        font-size: 25px;
                        letter-spacing: 2px;
                      "
                    >
                      Lemon
                    </div>
                  </div>
                  <div
                    style="
                      width: 100%;
                      height: 25%;
                      border-top: 1px dashed #0d0e43;
                      color: #0d0e43;
                      font-size: 14px;
                    "
                  >
                    <div style="margin-bottom: 5px">
                      Hotline:
                      <a
                        href="tel:0359806602"
                        style="text-decoration: none; color: #0d0e43"
                        target="_blank"
                        >(+84) 359 806 602</a
                      >
                    </div>
                    <div style="margin-bottom: 5px">
                      Địa chỉ: 12 Nguyễn Văn Bảo, phường 5, quận Gò Vấp, TP.HCM
                    </div>
                    <div>Theo dõi chúng tôi tại:</div>
                    <div>
                      Facebook:
                      <a
                        href="https://www.facebook.com/profile.php?id=100008079398913"
                        style="text-decoration: none"
                        target="_blank"
                        >https://www.facebook.com/profile.php?id=100008079398913</a
                      >
                    </div>
                    <div>
                      Instagram:
                      <a
                        href="https://www.facebook.com/profile.php?id=100008079398913"
                        style="text-decoration: none"
                        >https://www.facebook.com/profile.php?id=100008079398913</a
                      >
                    </div>
                  </div>
                </div>`
              }
          }
      }]

      const template = mailTemplate.find((element) => element.lang === lang)

      callback(template?.template)
  }
}