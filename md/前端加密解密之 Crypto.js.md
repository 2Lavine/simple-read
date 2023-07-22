> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/6844903742370742279?searchId=20230722164117366D8610A656DA70F4E6)

**前端 js 加密概述**

> 对系统安全性要求比较高，那么需要选择 https 协议来传输数据。当然很多情况下一般的 web 网站，如果安全要求不是很高的话，用 http 协议就可以了。在这种情况下，密码的明文传输显然是不合适的，因为如果请求在传输过程中被截了，就可以直接拿明文密码登录网站了。

> HTTPS（443）在 HTTP（80）的基础上加入了，SSL（Secure Sockets Layer 安全套接层）协议，SSL 依靠证书来验证服务器的身份，并为浏览器和服务器之间的通信加密。传输前用公钥加密，服务器端用私钥解密。

> 对于使用 http 协议的 web 前端的加密，只能防君子不能防小人。前端是完全暴露的，包括你的加密算法。知道了加密算法，密码都是可以解出的，只是时间问题。而为了保证数据库中存储的密码更安全，则需要在后端用多种单向（非对称）加密手段混合进行加密存储。

> 前端加密后端又需要解密，所以需要对称加密算法，即前端使用 encrypted = encrypt(password+key)，后端使用 password = decrypt(encrypted +key) ，前端只传输密码与 key 加密后的字符串 encrypted ，这样即使请求被拦截了，也知道了加密算法，但是由于缺少 key 所以很难解出明文密码。所以这个 key 很关键。而这个 key 是由后端控制生成与销毁的，用完即失效，所以即使可以模拟用加密后的密码来发请求模拟登录，但是 key 已经失效了，后端还是验证不过的。

> 注意，如果本地环境本就是不安全的，key 被知道了，那就瞬间就可以用解密算法解出密码了。这里只是假设传输的过程中被截获的情形。所以前端加密是防不了小人的。如果真要防，可以将加密算法的 js 文件进行压缩加密，不断更新的手段来使 js 文件难以获取，让黑客难以获取加密算法。变态的 google 就是这么干的，自己实现一个 js 虚拟机，通过不断更新加密混淆 js 文件让加密算法难以获取。这样黑客不知道加密算法就无法解出了。

> 常用的对称加密算法有 DES、3DES（TripleDES）、AES、RC2、RC4、RC5 和 Blowfis。可以参考：常用加密算法的 Java 实现总结 **前端加密解密应用之 VUE 项目** 通过 npm install 进行包安装

```
npm install crypto-js --save
复制代码
```

新建一个公用的 js utils 中新建 crypto.js 这里采用 AES 方式进行加密

```
const CryptoJS = require('crypto-js');  //引用AES源码js

const key = CryptoJS.enc.Utf8.parse("1234123412ABCDEF");  //十六位十六进制数作为密钥
const iv = CryptoJS.enc.Utf8.parse('ABCDEF1234123412');   //十六位十六进制数作为密钥偏移量

//加密方法
function Encrypt(word) {
    let srcs = CryptoJS.enc.Utf8.parse(word);
    let encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    return encrypted.ciphertext.toString().toUpperCase();
}

//解密方法
function Decrypt(word) {
    let encryptedHexStr = CryptoJS.enc.Hex.parse(word);
    let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    let decrypt = CryptoJS.AES.decrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
}

const desKey = CryptoJS.enc.Utf8.parse("11");

//DES加密方法
function desEncrypt(message) {
    let encrypted = CryptoJS.DES.encrypt(message, desKey, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
}
//DES解密方法
function desDecrypt(ciphertext) {
    if(ciphertext===""||ciphertext===null||ciphertext===undefined){
        return "";
    }
    if(typeof(ciphertext)!="string"){
        ciphertext=ciphertext.toString();
    }
    var decrypted = CryptoJS.DES.decrypt({
        ciphertext: CryptoJS.enc.Base64.parse(ciphertext)
    }, desKey, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
}


export default {
    Encrypt,
    Decrypt,
    desEncrypt,
    desDecrypt
}

复制代码
```

在 vue 文件中进行引用

```
<template><div>模版</div></template>
import crypto from "@/utils/crypto.js";
export default {
    data(){
        return {}
    },
      created() {
      /**这里仅仅用于演示**/
          console.log(crypto.Encrypt(122)) // 加密
          console.log(crypto.Decrypt(crypto.Encrypt(122))) // 解密
      }
}
复制代码
```

**前端加密解密应用之 requireJS 项目**

```
//这里是require的一个组件 Tripledes是Crpto.js库
define(['jquery','Tripledes'], function ($,Tripledes){
    var groupCrypto = {};
    var fn={
        key:'huakangdashen'//Ĭ秘钥
    }
    CryptoJS.mode.ECB = (function () {
        var ECB = CryptoJS.lib.BlockCipherMode.extend();
        ECB.Encryptor = ECB.extend({
            processBlock: function (words, offset) {
                this._cipher.encryptBlock(words, offset);
            }
        });
        ECB.Decryptor = ECB.extend({
            processBlock: function (words, offset) {
                this._cipher.decryptBlock(words, offset);
            }
        });
        return ECB;
    }());
    /**加密方法**/
    groupCrypto.encryptByDES=function(message, key) {
        /**判断传参类型**/
        if(message===""||message===null||message===undefined){
            return "";
        }
        if(typeof(message)!="string"){
            message=message.toString();
        }
        var keyHex = CryptoJS.enc.Utf8.parse(key||fn.key);
        var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        return encrypted.toString();
    }
    /**解密方法**/
    groupCrypto.decryptByDES=function(ciphertext, key) {
        if(ciphertext===""||ciphertext===null||ciphertext===undefined){
            return "";
        }
        if(typeof(ciphertext)!="string"){
            ciphertext=ciphertext.toString();
        }
        var keyHex = CryptoJS.enc.Utf8.parse(key||fn.key);
        var decrypted = CryptoJS.DES.decrypt({
            ciphertext: CryptoJS.enc.Base64.parse(ciphertext)
        }, keyHex, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        return decrypted.toString(CryptoJS.enc.Utf8);
    }
    return groupCrypto;
});

复制代码
```

这里是 require 的一个组件 Tripledes 是 Crpto.js 库 这里用的是 DES 加密 本代码只是示例 秘钥位置需要自己根据项目实例进行规划放什么地方。也可以请求接口由后端生成 每次生成不同的 key。

> 之后入参的时候进行加密入参 后端返回的重要参数可以是加密后的 前端进行解密处理