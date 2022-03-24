
export class maiTemplateService {
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
                    content: `
                      <div style="height: 100vh; width: 100%; position: relative">
                        <div
                          style="
                            width: 500px;
                            height: 500px;
                            padding: 10px 30px;
                            background-color: white;
                            border-radius: 10px;
                            box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
                            position: absolute;
                            bottom: 50%;
                            left: 50%;
                            transform: translateX(-50%) translateY(50%);
                          "
                        >
                          <div
                            style="
                              width: 100%;
                              height: 20%;
                              display: flex;
                              flex-direction: column;
                              align-items: center;
                              justify-content: center;
                            "
                          >
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
                            <div style="width: 20%; height: 80%">
                              <img
                                style="width: 100%; height: 100%"
                                src="https://img.icons8.com/clouds/100/000000/handshake.png"
                                alt=""
                              />
                            </div>
                          </div>
                          <div
                            style="
                              width: 100%;
                              height: 60%;
                              display: flex;
                              flex-direction: column;
                              align-items: center;
                            "
                          >
                            <p style="text-align: left; width: 100%; color: #0d0e43">
                              Chào <b> Đỗ Đạt Đức, </b>
                            </p>
                            <p style="color: #0d0e43; margin-top: 20px">
                              Chúng tôi rất vui mừng vì bạn đã lựa chọn chúng tôi. Chúng tôi cần
                              phải xác thực tài khoản của bạn. Vui lòng nhấn vào nút
                              <b> <i>Xác thực tài khoản</i> </b> bên dưới!
                            </p>
                            <a
                              style="
                                margin-top: 10px;
                                padding: 10px 20px;
                                background-color: #fb2e86;
                                color: white;
                                border-radius: 5px;
                                cursor: pointer;
                                text-decoration: none;
                              "
                              href="http://localhost:3000/verifyAccount"
                              target="_blank"
                            >
                              Xác thực tài khoản
                            </a>
                            <p style="margin-top: 10px; color: #0d0e43">
                              Nếu như có bất kì câu hỏi nào, vui lòng trả lời vào email này -
                              chúng tôi luôn sẵn sàng hỗ trợ bạn!
                            </p>
                            <p
                              style="
                                text-align: left;
                                width: 100%;
                                color: #0d0e43;
                                margin-top: 10px;
                              "
                            >
                              Trân trọng,
                            </p>
                            <p
                              style="
                                text-align: left;
                                width: 100%;
                                color: #0d0e43;
                                font-weight: bold;
                                font-size: 25px;
                              "
                            >
                              Lemon
                            </p>
                          </div>
                          <div
                            style="
                              width: 100%;
                              height: 20%;
                              border-top: 1px dashed #0d0e43;
                              color: #0d0e43;
                              display: flex;
                              flex-direction: column;
                              justify-content: center;
                              font-size: 14px;
                            "
                          >
                            <p style="margin-bottom: 5px">
                              Hotline:
                              <a
                                href="tel:0359806602"
                                style="text-decoration: none; color: #0d0e43"
                                >(+84) 359 806 602</a
                              >
                            </p>
                            <p style="margin-bottom: 5px">
                              Địa chỉ: 12 Nguyễn Văn Bảo, phường 5, quận Gò Vấp, TP.HCM
                            </p>
                            <p>Theo dõi chúng tôi tại:</p>
                            <div style="margin-top: 10px;">
                              <a
                                href="https://www.facebook.com/profile.php?id=100008079398913"
                                style="text-decoration: none; color: #0d0e43; font-size: 20px; margin-right: 10px; "
                                target="_blank"
                                ><i class="fa-brands fa-facebook-f"></i></i
                              ></a>
                              <a
                                href="https://www.facebook.com/profile.php?id=100008079398913"
                                style="text-decoration: none; color: #0d0e43; font-size: 20px; "
                                target="_blank"
                                ><i class="fa-brands fa-instagram"></i></i
                              ></a>
                            </div>
                          </div>
                        </div>
                        <div style="width: 100%; height: 20%; background-color: #7e33e0"></div>
                        <div style="width: 100%; height: 80%; background-color: #f4f4f4"></div>
                      </div>`
                }
            }
        }]

        const template = mailTemplate.find((element) => element.lang === lang)

        callback(template?.template)
    }
}