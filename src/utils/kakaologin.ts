declare const Kakao: any;

export interface IkakaoLoginSucceed {
  access_token: string;

  expires_in: number;

  refresh_token: string;

  refresh_token_expires_in: number;

  scope: string;

  token_type: string;
}

export interface IKakaoLoginResult {
  nickname: string;
  email: string;
  thumbnail_image: string;
  isError?: boolean;
  error?: any;
}

export class KakaoService {
  static async login() {
    if (!Kakao?.isInitialized()) {
      console.log("isInitialized");
      Kakao.init("d972126dd226ebd3cabb4850089c022f");
    }

    console.log("Kakao", Kakao);
    const kakao_login_response = await this.kakao_login();
    console.log("kakao_login_response", kakao_login_response);
    return kakao_login_response;
    //
    // if (kakao_login_response?.isError) {
    //   return kakao_login_response;
    // }
    // const kakao_auth_response = await this.kakao_auth();
    // if (kakao_auth_response?.isError) {
    //   return kakao_login_response;
    // }
    //
    // const result: IKakaoLoginResult = {
    //   nickname: kakao_auth_response.kakao_account.profile.nickname,
    //   email: kakao_auth_response.kakao_account.email,
    //   thumbnail_image:
    //     kakao_auth_response.kakao_account.profile?.profile_image_url,
    // };
    //
    // return result;
  }

  static async kakao_login() {
    if (!Kakao) {
      return;
    }

    if (!Kakao?.isInitialized()) {
      Kakao.init("d972126dd226ebd3cabb4850089c022f");
    }

    return new Promise<any>((resolve: any, reject: any) => {
      Kakao.Auth.login({
        success: (response: IkakaoLoginSucceed) => {
          console.log("kakao login", response, resolve);
          resolve(response);
        },
        fail: (error: any) => {
          console.log("kakao login error", error);
          reject({
            isError: true,
            error,
          });
        },
      });
    });
  }

  static async kakao_auth() {
    if (!Kakao) {
      return;
    }

    if (!Kakao?.isInitialized()) {
      console.log("isInitialized");
      Kakao.init("d972126dd226ebd3cabb4850089c022f");
    }

    return await new Promise<any>((resolve: any, reject: any) => {
      Kakao.API.request({
        url: "/v2/user/me",
        success: (response: any) => {
          console.log("kakao user", response);
          resolve(response);
        },
        fail: (error: any) => {
          console.log({ error });
          reject({
            isError: true,
            error,
          });
        },
      });
    });
  }

  static async kakao_logout() {
    if (!Kakao) {
      return;
    }
    if (!Kakao?.isInitialized()) {
      console.log("isInitialized");
      Kakao.init("d972126dd226ebd3cabb4850089c022f");
    }

    return await new Promise((resolve: any) => {
      if (Kakao.Auth.getAccessToken()) {
        Kakao.cleanup();
        Kakao.Auth.logout(() => {
          console.log("Kakao logout");
          resolve(true);
        });
        return;
      } else {
        console.log("Kakao not logged in");
        resolve(false);
        return;
      }
    });
  }
}
