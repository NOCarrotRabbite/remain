/* eslint-disable */
class eccEs6 {
  constructor() {
    this.e = new E(
      BigInteger.probablePrime(30, rand).intValue(),
      rand.nextInt(1024),
      rand.nextInt(1024)
    );
  }
}
let e = new E(); // 椭圆曲线
let pare; // 椭圆曲线上已知点G
let privateKey; //私钥
let publicKey; // 公钥

class E {
  // 表示椭圆曲线方程
  constructor(p, a, b) {
    this.p = p;
    this.a = a;
    this.b = b;
  }
}

class Pare {
  // 椭圆曲线上的点
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  // 加法
  add(pare) {
    if (
      this.x == Number.POSITIVE_INFINITY ||
      this.x == Number.NEGATIVE_INFINITY
    ) {
      // 无穷大时
      return pare;
    }
    let res = new Pare();
    if (this.y == pare.y && this.x == pare.x) {
      // 相等时
      let d = moddivision(3 * Math.pow(this.x, 2) + e.a, ECC.e.p, 2 * this.y);
    }
  }

  moddivision() {}
}
