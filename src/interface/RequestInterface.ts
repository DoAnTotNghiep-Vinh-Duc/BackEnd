import { Request } from "express"
export interface IGetPayloadAuthInfoRequest extends Request {
  payload: any // or any other type
}