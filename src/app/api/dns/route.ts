import {NextResponse} from "next/server";
import {PayloadProps} from "@/interface/payload";
import axios from "axios";

export async function POST(req: Request) {
  const data: PayloadProps = await req.json();

  if (data) {
    try {
      const res = await axios.post(`https://api.cloudflare.com/client/v4/zones/${process.env.NEXT_PUBLIC_ZONE_ID}/dns_records`, data, {
        headers: {
          'X-Auth-Key': process.env.NEXT_PUBLIC_AUTH_KEY,
          'X-Auth-Email': process.env.NEXT_PUBLIC_AUTH_EMAIL,
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
          "Access-Control-Max-Age": "86400",
        }
      });
      if (res.data.success) {
        return NextResponse.json({message: 'DNS Record generated successfully.', success: true}, {status: 200})
      }
    } catch (err: any) {
      return NextResponse.json({message: err.response.data.errors[0].message, success: false}, {status: 400})
    }
  }
}