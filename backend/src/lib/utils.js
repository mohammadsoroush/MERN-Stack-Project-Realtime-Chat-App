import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  //توکن می‌سازه. فقط همین. نه ذخیره می‌کنه نه چیزی
  const token = jwt.sign({ id: userId }, process.env.jwtSecretKey, {
    expiresIn: "7d",
  });

  //توکن ساخته شده را داخل کوکی مرورگر ذخیره می‌کنه.
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.nodeEnv === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  // res.cookie("token", token, {
  //   httpOnly: true,
  //   secure: false, // مهم: چون https نیستی
  //   sameSite: "lax", // STRICT ممنوع
  //   path: "/",
  //   maxAge: 7 * 24 * 60 * 60 * 1000,
  // });

  return token;
};
