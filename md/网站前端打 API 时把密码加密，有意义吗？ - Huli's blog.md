> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [blog.huli.tw](https://blog.huli.tw/2023/01/10/security-of-encrypt-or-hash-password-in-client-side/#)

内容是他看到了一个问题：[请问登入 api 传账号、密码 json 明码会有问题吗？](https://www.facebook.com/groups/f2e.tw/posts/5689037364466915)，想知道大家对这个问题的看法。而底下的回答大部份都是觉得「有用 HTTPS 就好了，没必要额外再实作一层加密，没有什么太大的意义」
但这一两年接触资安以后，我的想法有了改变，我认为前端在传输前把密码加密，是有其意义的，而接下来我会详细说明我的理由。
定义问题
----
首先，我们要比较的对象是：
1.  在使用 HTTPS 的前提下，打登入 API 时不做任何事直接传送密码的明文
2.  在使用 HTTPS 的前提下，打登入 API 时先把密码加密，再传送到 server

最后呢，我这边的情境是「加密密码」而非 hash，这是因为我觉得 hash 的状况比较复杂，我自己想先用加密来举例，而且这个加密是「非对称式加密」。

综合以上，这篇想处理的问题是：
「已经使用了 HTTPS，在打登入 API 以前先把密码加密过或是不做任何处理，这两者的差别在哪？」

而我们可以把回答分成两个部分：
1.  假设 HTTPS 被破解了，是不安全的，差别在哪？
2.  假设 HTTPS 是安全的，差别在哪？

假设 HTTPS 不安全，差别在哪？
-----------------
怎样的状况会造成 HTTPS 不安全，攻击者掌握了系统的哪些部分？
底下简单分为四种状况讨论：
1.  攻击者掌控整台计算机，信任恶意凭证
2.  攻击者成功执行了中间人攻击
3.  攻击者可以在网络层监听 request 并使用漏洞取得明文
4.  攻击者直接针对 HTTPS server 进行攻击
### 攻击者掌控整台计算机，信任恶意凭证
若是这种类型的状况，那当然是有没有加密都没差，因为攻击者都有其他更好的手段去取得你的密码。
### 攻击者成功执行了中间人攻击
那如果是「攻击者成功执行了中间人攻击（Man-In-The-Middle）」
- 你的计算机没事，只是数据包在传输的过程中被中间人攻击。
- 在这样的前提底下，没加密的情形就能直接被获取密码，而有加密的情形攻击者只能获取到加密过的密文而非明文。 
但需要注意的是既然是叫中间人攻击，
- 那攻击者除了监听你的 request 以外，也能发送伪造的 response 给你，把前端用来加密密码的部分换掉。
- 因此无论密码是否加密，攻击者都可以拿到明文，只是如果有加密的话，攻击者取得密码的成本较高（需要先找到在哪边加密的，然后把那段改掉）。
### 攻击者可以在网络层监听 request 并使用漏洞取得明文
这个状况跟上一个的不同之处在于这个只能读，不能写。 若是有办法解密 request 的数据包，就能够看到明文。

所以如果有把密码先加密，攻击者就无法取得密码的明文。

这边需要注意的是尽管无法取得明文，攻击者依然可以透过重送请求来登入你的账号（先假设没有其他机制），所以你账号还是被盗了，只是攻击者不知道你的密码明文。

这有差吗？ 有！

假设他知道了你的密码明文，就可以拿你的这组账号密码去各个服务都试试看，若是你其他网站也用同一组账号密码，就会跟着沦陷（俗称的撞库攻击）。

因此在这个状况底下，加密密码的安全性显然是更高的。

> 假设攻击者可以取得 HTTPS 的明文，那确实自己在应用层加密会更安全，但要符合这个假设的成本很高，发生概率很低

### 攻击者直接针对 HTTPS server 进行攻击

这个分类我指的是在 2014 年发生过的 [Heartbleed](https://devco.re/blog/2014/04/11/openssl-heartbleed-how-to-hack-how-to-protect/) 漏洞，攻击者可以藉由 OpenSSL 的漏洞读取到 server 的内存。

这个状况跟上一个满像的，如果有在 client 端先加密过密码，那攻击者在 server 上读到的就是加密过后的，不知道密码明文是什么。

所以结论跟上个一样，就是加密密码会更安全。

中场总结
----

刚刚我们讨论了几种「HTTPS 变得不安全」的状况，从以往发生过的案例可以得知「HTTPS 变得不安全」是有可能的。若是攻击者能够读到 HTTPS 传输的明文，那在应用层将密码加密，就能防止攻击者取得密码的明文，因此会比没有加密来得更安全。

如果要讲得更详细，可以从两个维度去切入，一个是严重性（severity），另一个是可能性（possibility）。

以严重性来说，不管有没有加密密码，只要攻击者有办法拿到 request 的内容，你的账号就已经沦陷了，而有没有加密唯一的差别只有攻击者是否能取得明文密码，有的话就可以执行撞库攻击，拿密码去试更多其他的网站。

而可能性就是「HTTPS 的明文被拿到」这件事的可能性，从过往的经历以及研究来看，虽然是有可能的，但在 2023 年的今天，概率是很低的。

因此我们现阶段的结论应该是：

攻击者若是可以绕过 HTTPS 拿到明文的 request，那在应用层将密码加密，确实会比较安全，但要注意的是要达成这个前提非常困难，发生的概率极低。

假设 HTTPS 是安全的
-------------

接下来我们讨论第二种状况，那就是假设 HTTPS 是安全的，没有任何人可以从中间看到明文的内容，这应该也是留言区中大多数人假设的前提。

在这种状况下，会有哪些风险呢？

有一个现实生活中会发生，而且也确实发生过的风险，那就是 logging。

身为前端工程师，在前端加装一些 error tracking 的服务是很合理的事情，若是我们直接实作一个「只要服务器回传 5xx，就把 request 记录起来」的机制，如果好巧不巧哪天登入的 API 出现这个状况，你就可以在 log 里面看到用户的明文密码。

而且不只前端，后端也可能有类似的机制，碰到一些问题就把 request 整个写到 log 档去，方便以后查看以及 debug，一不小心密码就可能被写进去。

在这种状况下，在 client 端先把密码加密显然是有好处的，那就是在这些错误处理的 log 中，被记录下来的密码会是密文，除非你有密钥，否则你是不会知道用户的密码的。

我在网络上找到一篇跟我论点一样的文章：[The case for client-side hashing: logging passwords by mistake](https://www.sjoerdlangkemper.nl/2020/02/12/the-case-for-client-side-hashing-logging-passwords-by-mistake/)，里面有附上很多参考链接，都是以前各大公司不小心把密码的明文记录下来的案例。

然后有个小地方稍微讲一下，上面这篇做的是「在 client 端 hash」，跟我这篇一开始设置的「在 client 端做非对称式加密」有点不同，hash 会更安全一点，确保在 server 真的没人知道你的密码明文是什么。

总之呢，在 client 端先把密码加密或是 hash，可以避免在日志中不小心出现用户的密码明文，这个显然是个额外的优点。

加密还是 hash？
----------

文章开头我有提到 hash 的状况有些复杂，所以我先把情境设置在「对密码做非对称式加密」再传输，因为对上面我举的那些例子而言，这两种情境的差异不大。

举例来说，HTTPS 被拿到明文内容，无论你对密码做了非对称式加密还是散列，在攻击者无法取得服务端密钥的前提之下，都是拿不到明文密码的。

那为什么 hash 的状况有些复杂呢？

假设我们在前端先把密码 hash 过后再传到后端，那后端是要直接存进去数据库吗？如果直接存进去数据库，哪天数据库的内容曝光，攻击者就拿到这些 hash 过的密码了。

通常在有加盐以及散列演算法够强的前提之下，被拿到 hash 的密码还是能保证一定的安全性，可是在这种情况下，反而变得很不安全。

因为前端传给后端的内容已经是 hash 过的了，所以攻击者可以直接拿 hash 过的密码进行登入，根本不用知道明文是什么。虽然保护了明文，但失去了原本散列的安全性。

因此如果要做 client side hashing，server side 收到后也要再做一次。如此一来，就算数据库被偷走，攻击者也没办法利用数据库中的 hash 直接登入。

有些人可能跟我一样好奇：「做两次 hash 不会更不安全吗？」，我们可以看一下 Google 在 [Modern password security for system designers](https://cloud.google.com/static/solutions/modern-password-security-for-system-designers.pdf) 里面怎么说：

> Have the client computer hash the password using a cryptographically secure algorithm and a unique salt provided by the server. When the password is received by the server, hash it again with a different salt that is unknown to the client. Be sure to store both salts securely. If you are using a modern and secure hashing algorithm, repeated hashing does not reduce entropy.

看起来是还好，问题不大。

总之呢，看起来最安全的但也更复杂的解法就是 client side 先 hash 一次，然后丢到 server 的时候再 hash 一次存进数据库，如此一来就可以保证：

1.  HTTPS 因为各种原因失效时，攻击者无法取得明文密码
2.  在 Server 端，没有任何人知道用户的明文密码
3.  明文密码不会因为人为失误被记录到 log 中

那如果真的比较好用，为什么没人在用？

现实生活中，到底有谁在前端做 hash 或是加密？
-------------------------

当我一开始碰到这个问题，讲出「怎么没人在用」的时候，其实只是「我自己没碰过有人这样用」，但实际上我并不知道那些知名网站的登入是怎么做的。

因此呢，我就直接去看了几个知名网站的登入机制，我们一起来看一下结果，为了方便观看，我把跟账号密码无关的内容都拿掉了。

我在测试的时候，基本上都是用 test 或是 [test@test.com](mailto:test@test.com) 搭配简单的密码如 1234 在测试，然后观察 request 的内容。

先来看一下 FAANG 吧！

### FAANG

#### Facebook

API 网址：[https://zh-tw.facebook.com/login](https://zh-tw.facebook.com/login)

请求内容：

```
email=test@test.com
encpass=#PWD_BROWSER:5:1673256089:AbJQAJUvZZNvh2dZbeDqdu9dp7HWwyHOl3+0sCGjiHMMjvYdxJokpdHE/O+E5LIbnakRmDWQfV40ZaB31MaNXFYo1b+RI+LHh6MAdDPa4PJ+BesDp4u8B4F4diVQ+q7idbEhT5wTNaU=
```

没想到 Facebook 就是有实作前端加密的网站！后面那段 Base64 并不是直接把密码 Base64，而是把加密过的密码做 Base64，解出来是这样：`\x01²P\x00\x95/e\x93o\x87gYmàêvï]§±ÖÃ!Î\x97\x7F´°!£\x88s\f\x8Eö\x1DÄ\x9A$¥ÑÄüï\x84ä²\x1B\x9D©\x11\x985\x90}^4e wÔÆ\x8D\\V(Õ¿\x91#âÇ\x87£\x00t3Úàò~\x05ë\x03§\x8B¼\x07\x81xv%Pú®âu±!O\x9C\x135¥`

#### Amazon

API 网址：[https://www.amazon.com/ap/signin](https://www.amazon.com/ap/signin)  
请求内容：`email=test@test.com&password=1234`

#### Apple

API 网址：[https://idmsa.apple.com/appleauth/auth/signin](https://idmsa.apple.com/appleauth/auth/signin)  
请求内容：`{"accountName":"test@test.com","password":"1234"}`

#### Netflix

API 网址：[https://www.netflix.com/tw/login](https://www.netflix.com/tw/login)  
请求内容：`userLoginId=test@test.com&password=1234`

#### Google

API 网址：[https://accounts.google.com/v3/signin/_/AccountsSignInUi/data/batchexecute](https://accounts.google.com/v3/signin/_/AccountsSignInUi/data/batchexecute)

请求内容：

```
f.req=[[["14hajb","[1,1,null,[1,null,null,null,[\"1234\",null,true]]]]
```

看来 FAANG 里面，只有 Facebook 是有实作的。

接着我突然好奇起其他常用服务的登入有没有做，底下贴结果。

#### GitHub

API 网址：[https://github.com/session](https://github.com/session)  
请求内容：`login=test@test.com&password=1234`

#### Microsoft

API 网址：[https://login.live.com/ppsecure/post.srf](https://login.live.com/ppsecure/post.srf)  
请求内容：`login=test@test.com&passwd=1234`

#### IBM cloud

API 网址：[https://cloud.ibm.com/login/doLogin](https://cloud.ibm.com/login/doLogin)  
请求内容：`{"username":"test@test.com","password":"1234"}`

看来有实作的是少数，那资安厂商呢？资安厂商自己有做吗？

### 资安厂商

#### Kaspersky

API 网址：[https://eu.uis.kaspersky.com/v3/logon/proceed](https://eu.uis.kaspersky.com/v3/logon/proceed)  
请求内容：`{"login":"test@test.com","password":"12345678"}`

#### 趋势

API 网址：[https://sso1.trendmicro.com/api/usersigninauth](https://sso1.trendmicro.com/api/usersigninauth)  
请求内容：`{"email":"test@test.com","password":"12345678"}`

#### Tenable

API 网址：[https://cloud.tenable.com/session](https://cloud.tenable.com/session)  
请求内容：`{"username":"test","password":"1234"}`

#### Proton

这个应该不算资安厂商，但突然很好奇强调隐私的 Proton 是怎么做的，一看发现好像很复杂。

在登入的时候会先把 username 送过去，拿到一些看起来是 key 的东西。

API 网址：[https://account.proton.me/api/auth/info](https://account.proton.me/api/auth/info)

```
{"Username":"test@test.com"}
```

```
{
  "Code":1000,
  "Modulus":"-----BEGIN PGP SIGNED MESSAGE-----\nHash: SHA256\n\nu9K5yr97L9VV2ijOSI62tJcewUiRhQa8qJa24baNpGyw0lf3JLiF4fxUHqTErwF9UdoxE0z4Kb147naphylBFddyKsjhzHNcxk2rBw9haiPxD69BrVYm0n+LVlPqmjXFF7btr1H7oqHGX4b4Dy9omL/KaZz/Dco2NEhw0UBhEZbTAs6Ch01ur9XLbSOI7yb6MRsqCehfy82gDTdbPtXvqQsQjg5XoC2Ib2qTYFaU/24mq/gOaMbVuAGX0hBYzr5NpN9ol2XCdHOLg28Xe90+kisg39VV04axy7Ndvh489dC1CxjcWSSpXd6cPJyOn/HH9aPeTZeucBllRGbPgwR6/w==\n-----BEGIN PGP SIGNATURE-----\nVersion: ProtonMail\nComment: https://protonmail.com\n\nwl4EARYIABAFAlwB1j0JEDUFhcTpUY8mAAD1GwEAoC91QCSfXPEuWM13NZvy\nvL9NQIABuSrVOvgJwMhUTnUBAPb4zbIdTYFOQNrPLvonJt2mmRNy4lGcW7uN\n5yHzJ18J\n=Oykn\n-----END PGP SIGNATURE-----\n",
  "ServerEphemeral":"DY6eRYM1bqYZZ5jzZFdWv88tKYP2PnS0y4A+f7/eqMXj8wB2VefV2kfIDrZ5AorWfDzBq4wMtNG2k5dzbT2qWppzpvltrSl2Nm4i8eWIRVxXWHl/46dGuPXFHUcXBNMP3XEQvft0YEbHOPO9Es0RZRaObV5XPFyx6kzOJxXc1tIt4PfbhODMfsAoy/yxt6eLN3HUiORCBOvzsH2sfG99Gx1YSAe3GL6g/K+bdg59eglueXRESoB0/VFRsvQevi9nVXx/JZNTG0U4BBUOlMjpYYMgEP6eQgZZ/09ZPYD3a2tW65mSnNt6lSDfwiKj02UuDqymTvj7mYm44T0SuAocwg==",
  "Version":4,
  "Salt":"dI7OcD+K4rGPBA==",
  "SRPSession":"3fa6224285409b6af07c811971e05341"
}
```

接着输入密码登入时，会送出如下的 request，看起来也很复杂：

```
{
  "ClientProof":"I9Nfd0Nd3OzODf2nt9zLxFHWogEwfRje8zjoeZnblyLfyzz23uXTjJ4qgRFomjIEEtZrlM1jTQa4wRIMGIIV7E6pMqq8c6wcc2tegP4Xt76S0EbnVtE1F9i0Wj46aCPUM0Mha3Zmgi9LKerrGlaftr2FBedjPFT9rPrbLqRQcFNMD33tn69gD/p28q4RAr3/7d/tz7TYhytD5oxCAUwrkqiZOi0kg//2mUJ9YNT2nWcgqUERoaU51NbNMcaPnMteEe1PlIJdiQbvNa5K07u8rk7itpBrGW2FP26bREp0UMTzNYM5HcDDkmp4dp9GoBjFJL9n0THUdt/oRRJ/Enj5WQ==",
  "ClientEphemeral":"D013N7FXYHylqMeWa6ctJIv3J4uF1hqodyYfw6O+Sj7MZOIB+wksfgk/nkXCmRxQhuSYwqwMJIpyFD3MEolOZAHMU2n6HQlxe9A4KbrE4gk3UiGwfgcZDmFejTmMMxfWhf4zO2Z1fBbohreqwwN0mz3AqqsfE5dsDh3LEfkiJB449YGZfHeUHyIzS1jTmnx/8l6uVSKwJDCJelVFYKMXrxVt0ltcGRoYD92MUj82kR0am+BN4+djHyYYXuwuIYArnTW4kDP3T2yCIAMVgZnFaUCc2gfynt40mQP4q87jmMELOl8TDIDo5iKyH4gJc/470qIuIyj4ffVLiZ7t8S+kcw==",
  "SRPSession":"3fa6224285409b6af07c811971e05341",
  "Username":"test@test.com",
  "Payload":{
    "qcA_CRYU6gSyHWdn":"c6UZSKPo4Sfm/3+DvQN72TTxyj+/TplKT9edDiUI5wMfGUsoJs9FGerOtkoW8T49r7KOvqHkzS2+M2v8ra7J9l5kSf5jgC9ZvgZ8Ja5Xgg02nxgAABydOirGLoL4htFsYVtwLrNg8NeSEanLwYLCVaSqkjANRJks0eaKpUOd8xRhCFtUH/GCbyg27oZfzDsqKXemKprOUsOh42NTqzEmruAkxs2x8mUsLy/vXptVAdaiJLrsSRqD0YBGjvOp4W2/0g6V2zfedJpJEzVwtSi1vXTC5bwxmEJlYdV9AiQECogAAJFxLQi7JjtmgFe4tNcv97JD0B8giZ6XS35swjz0vz0mOjVBUwmiDa8n54Y5kBaAoZe5pijdp2S4SOcRAknDIcD1nf0v7oSMOE9WtH/sa+XI1D2s5lFKo/iInf7r5R9src2hHFoy0b2XT0oCfLPwFX87yjaKbf7bbkjByx/3dOgzEliAkS6nHK+fmeDDVM4EoZqVSKZHLg3QTcg4DKaICyDsotALr2UqI/ARzkX4yhAXz5xHFaxl6hWAKLJPJcgk6il6oX0s0PCBNSY0Fi3vbQvXD4WalUx+LBNto6CUqeAIzVuAh8sCubzufoSORypE5WqfnuJzAlZ9sMEjaQycuRi497aV3jmjgx53UwO0OiZGxDTEMFBcov4P0g1blZ4vxmULhZU0RfdP31udLr6GTCAB90CM6Vk9w9CsYM+hmo3+JpEAtIVgLVVqcPikTbV+yaOJ1RknxBf3g06kTl0LQ+zBV6pG2rFVi8G4XT9L4FsIgxTNsl/ryzs8vJU7K+HvyE1Lp2pAXrfcju7TAIqK/FOXvp1c8Ay9O6d4fmd/PZalnRDv5mQ6Gmd6JSNzNh6i6AibBuF13w3OBaulY3FGNU/cH/AXLBIqjSzf/OySwkKkC9HBurSs3D0zqcH9BwUpmPEL8jbc8yPE+hPAim+tDo1BXCQNClxgGLaI6FXkuCiQ4AHiKsq0xs5b3WAFzcvBv1rc003RWxRegH/2teIooKU9w1kDPQRaK8/rIYe8u+BlBeZq4OwCXxx56JHfmTxtJwBi95KqsWzLGtY3ILcb+/XkzSRmE2TWbkW1IXzRsl8F6NSJj7JnHA3UrQf4hxuwbaYxpKJrcHuHc8e1wxqXrUSKooCOUxwSBgxvLLT37eaByNTxpfWomxIsH671wuydnmMedWyNIqyaMtxBORuiWUiG4jbMC2BjrVptXJ7VWigf3Vy5OQlMOyTx8tLWi1qZODYyywMBAvHYQlFfSqmIrm4y4dmK/srJE/+daEnNS+kWF48Jm/rQORO5AUwqWL+Lefg9pchcL1BnHOANcviO8pAkxLo8TiK7VLKI5/xUsZQoQSlhRt27zMF+sIv+exY375HApiY+a1VQ6OqE4Nvba7O8ETLoLFg4a8Aj+W8erXFHW5F0vVIRphAve9orM4QYnAmOigFAiLb0Pxx124wUjFR9s5oP98hAtNL/t+uGAXrb0oxiCfyHb9wa2Qb0x6o9FpuBIc5ZXId+cEXEvOdqhnUQ7ZuOi/fX81hlqgUaiD/A6P+zjAcREXdktd+hrhSXwCIKSBkp/mNymnalQKJkLaNVT+W2sOWqXxTSTIytCQx36xABcj1BXRApntob6Qvche8QJLTjzr9bDpn+Mo59N9PSU51DPIj5Avre6ChTHEQvjz9s1IM2XroBX/KFBnPj33aYQZyov4uxrVXxic+fiY+fLMF8x1ut/eNWeQU6fn+rU5PEGQ9bbAsjVBZYA5H93ROhO5lnSxoEk5PHkgQ9WpxueckPjJIUGAs+O8QMRFicccfKjhNIc32rXTqbVqLyoz62riDn8Y18MUBoeI8ORyqZOKEEBFsi5dwqoq8t82NFdx5LFjsLdk4RmMXZ2uygNLk8gH2Yyfu3iOQS2bKtNCW42Xmo66Xu5kt8NwAneYQK0mTn6HUv94K10J4hY+Q="
  }
}
```

补充：经讨论串有人提醒后发现这是一个叫做 SRP（Secure Remote Password）的协议，Proton 有提供一个 [ProtonMail Security Features and Infrastructure](https://proton.me/static/9f5e7256429a2f674c943c5825257b82/protonmail_authentication_excerpt.pdf)，里面有记录他们的安全措施，就有讲到这个机制。

看起来满复杂要花不少时间研究，先放着，有兴趣的可以参考：[SRP — 更健全的登入及数据传输保护协议](https://blog.amis.com/srp-1f28676aa525)

虽然更安全，但成本应该又更高了。

### 交易所与银行

看完上面案例发现有做的是少数，因此我好奇更注重安全的加密货币交易所与传统银行有没有做。

#### Binance

API 网址：[https://accounts.binance.com/bapi/accounts/v2/public/authcenter/login](https://accounts.binance.com/bapi/accounts/v2/public/authcenter/login)

请求内容：

```
{
  "email":"test@test.com",
  "password":"fe2e6b4138fcd7f27a32bc9af557d69a",
  "safePassword":"d404559f602eab6fd602ac7680dacbfaadd13630335e951f097af3900e9de176b6db28512f2e000b9d04fba5133e8b1c6e8df59db3a8ab9d60be4b97cc9e81db"
}
```

#### Coinbase

API 网址：[https://login.coinbase.com/api/v1/authenticate-credentials](https://login.coinbase.com/api/v1/authenticate-credentials)

请求内容：

```
{"email":"test@test.com", "password":"1234"}
```

#### kraken

API 网址：[https://www.kraken.com/api/internal/account/settings/tfa](https://www.kraken.com/api/internal/account/settings/tfa)

请求内容：

```
{"username":"test", "password":"1234"}
```

#### 玉山银行

API 网址：[https://ebank.esunbank.com.tw/fco/fco08001/FCO08001_Home.faces](https://ebank.esunbank.com.tw/fco/fco08001/FCO08001_Home.faces)

请求内容：

```
loginform:custid=A0000...
loginform:name=mxagZmaqygDx0XX6784Svw==__NgZQcFfAx+lQmPza2eNpOA==
loginform:pxsswd=8,lIRnuUxw/yStOt9QIYG2U3Gn2XkG03x4Ey/UU6JGtsbUxfRXoAv9CjE3EWerDN3tfx3dD/B3ChLAPMSG2BA3jMXUCZC06y8UbQ5isKc9fCWZSSZAWWcOmJ7LdXw1ZhjV55hpw1upvAr9WEmZ0XF6x7if+dBxJ4KZ00d83qA9eA+3VaSk+JLhN8/CFBfTKTfJEs3PDNsm12XzRUBb4YE1aPQosVX10mdvh3zY5lmkrKuq8gnuImEf3oLOk4EF3eVpr6jJiFzMKlHybvGdtKYS25+pgTS68wn3v023barbSmgivcv5atm0XsyXWDY2dKEtdQz+7A6R+AB0bExbQlRjqQ==
```

#### 国泰世华

API 网址：[https://www.cathaybk.com.tw/MyBank/Quicklinks/Home/NormalSignin](https://www.cathaybk.com.tw/MyBank/Quicklinks/Home/NormalSignin)

请求内容：

```
CustID=A000...
UserId=DC0C6E52BE2A2354C53401207F220F1B
Password=8cf5e1977f149ed0362629007a7f91d0efc7b12cb1895ba701c528a12b38d12f8148ca03ee671fe25d2a3a807be980f7728566e359a675734ce046899b147658388bb60f9b900e2ccc9adac280b54b5f2e28cb7eee1b634d0e1ed1c0c0c598c350f61eb003405559331a7f047add7289466bf42cfd5b9e774a1fa116af4fd7050adb8f174d42a8e2098a014a788bd2ffae3bf4ff7a8d8d7e2e8068402fda395da41be6e5d32f2d32cbee2afc26e82c58b60357b5cb186a3b9cf69df2deb9da8c9fde45337935180cb4e177109413d7a758d38bfc8334a4509d8d8fb6a37080f0e0086b4a5ef68f7809ca2ef97183b7f66d996873bb7dbfcee61d2da424b8b968
```

#### 中国信托

API 网址：[https://www.ctbcbank.com/IB/api/adapters/IB_Adapter/resource/preLogin](https://www.ctbcbank.com/IB/api/adapters/IB_Adapter/resource/preLogin)

请求内容：

```
{
  "rqData": {
    "custId": "A00....",
    "pin": "878dbee38bbb4d77a30ee128f55f7bfe2169e45380d62a75453d3ca175e8ce8b|43d0499147b62adeec4eef3c77d33171b4569d0bdf7bbbe2b8b9bde3d30a26aba69aadfb28dfbaa9a997a0ccf668aaab0b6da582275175272172569a58a60bbfc5ac3a8c6862ce31f86247d7c1adf307e363c0f251fb88c4d39afa6ed0ca0a49e053f4f90000fa77b4e78beaead72ebdf52a13ecb4f20ae9a532947fad8156d5ec69d6763243364e71659079e469d1e01d0c384b0c71f4e9e524890227d82a51a340ef0b48638e05e347d75cb93d4a825a2bce6a90ef47f512351ee2d0d1ea17fb8afd521e427578603ea775191711f81d8dcb18e46b72daf3a49a60e50d12d3887e3bafab3758730f7fb0276373ebe1da01a03162ec8e73a202091a51b7f88d",
    "userId": "bfcdb9b2d6896a3bfb4a6542e8fb2689486d000b11bdc0c7bc336a6534aec74c|1b1a758bb26702bc0ac7cd660da2a72866f2cfdcf3668f2d39a5f8b006854f52a08f418b0a460b36374f95b7a310d73ea9994788698041f524ecd1f153448ab5d51f901a9a08ac2a9ee04c5c273ecb9d4ec1b6a62e9696c6126271e2f8c334fe17ce8b8538139363b90be75c1130cb251ec240bd26c920b52f5be9fc59094ce7d935d826242d69dc1ff7047a5abbf11d3c7de639a14bb10230912903cd948c05b3b3cb0cdb100f979640e291774e623a7109bde7b55bb8a6a373c0ca12820b072132ea61c845e60e26d09c7ee0fe23f7de286cbccb067a86fd1985c5b455f9ae46ce24dc8f52bcb05c205d6a462345162ae82c35e045bf3fd43a297c3edcfe17"
  }
}
```

#### 美国银行

API 网址：[https://m.globalcard.bankofamerica.com/pkmslogin.form](https://m.globalcard.bankofamerica.com/pkmslogin.form)

请求内容：

```
username=fcc63767-1a43-4cc6-8c3e-1346350b5274
password=12345678
```

#### 新加坡星展银行

API 网址：[https://internet-banking.dbs.com.sg/IB/Welcome](https://internet-banking.dbs.com.sg/IB/Welcome)

请求内容：

```
USER_LOGON_NAME=test123
ENCRYPTED_PIN_BLOCK=A8C48B7572A1A53C5A66E9B43365027C7FBF14BF461F480A46781E49648A8F70271A29C374F86FCD55A76ED17B2284B47C799B74475F29749D68631FF7E322177A21EEE8C41D8950638A2828C34A2653D7C9F69F5DA568E42D64CE89FCE8F024217B235835E6F8BC3C536F56361EDF459AFCE9A512BDBACAB2D25423209996C2E84A18EA8446685DAF9FAD4B1D6D8DF0F378EC27D9A81AD4D1A2B91BA3CFD838140A9BD48AD8D38D33B0093110BD1CA2C76F3DE4CBD969A9B0260DB890E9B1A99DC1193BFE9A1EDB3E56F71CB1CD8630558B242B040F733A4A40B2E17DE6DA03A58DEC8BB12DA87BB25971E2DBE5AF7AE6112266A3F9027B449BDF46D8DC0A1A
```

结论
--

在随机想到的 20 个网站中，有 7 个有在前端做加密或是 hash（我懒得看是哪个了，总之有做事就对了），名单是：
1.  Facebook
2.  Proton
3.  Binance
4.  玉山银行
5.  国泰世华
6.  中国信托
7.  新加坡星展银行

虽然说 35% 看起来很高，但那是因为银行占了大多数，一般网站则是很少实作这个机制。

写到这边，可以来下结论了。

第一个结论是：「在 client 端发送密码前先把密码加密或是 hash，确实能够增加安全性」

理由是做了以后，能够达成以下事项：
1.  HTTPS 因为各种原因失效时，攻击者无法取得明文密码
2.  在 Server 端，没有任何人知道用户的明文密码
3.  明文密码不会因为人为失误被记录到 log 中
以上都是没有在 client 加密或是 hash 时做不到的。

而第二个结论是：「确实有些大公司有做这个机制，但是非大多数，不过在银行业似乎是主流」
这个结论上面有贴完整的数据了，一般的网站很少做这个机制，但还是有人做。
第三个结论是：「虽然从技术上来看能够增加安全性，但实际上是否实作，仍然要考虑其他因素」
这因素就是我前面提过的「可能性」还有开头我讲先不谈的「成本」。
若是真的比较安全，为什么一般网站不会实作这个机制？
- 或许是因为觉得 HTTPS 被攻破的可能性太低，低到可以忽略不计（我相信这是大多数留言的人觉得不需要做的理由，我也同意这点）
- 也或许是成本太高，会增加程序码复杂度；若是采用加密的方案，也会消耗更多运算的资源在加解密上面，这也是成本。

这就是我觉得应该讲清楚的地方。

在前端先做 hash 或是加密，它确实是有优点的，不是多此一举，也不是没有意义，更不是让系统变得更危险。

但这不代表每个系统都该实作这个机制，因为它带来的效益或许没有成本高，这个端看各个公司的考量。对大部分的公司来说，与其为了 HTTPS 失效这个极低的可能性去投入成本，不如把时间花在加强其他登入环节的安全性（例如说 2FA 啦，或是不同设备登录警告等等），带来的效益会更高。

有些服务还会选择把整包 request 都加密，而非只有密码，这个又更安全但是成本又更高，而且 debug 很不方便。虽然说既然加密做在 client 端，攻击者一定有办法逆向这个机制，看出是怎么做的，但这不代表这些机制没帮助。

举例来说，假设我有个抢票 App 不想让别人知道 API 怎么调用，于是就实作了一个超复杂的加解密机制，尽管高手还是可以做逆向工程，写出一个抢票机器人，但这个机制增加了他的时间成本以及对技术的要求。

以技术上来说，就算理论上一定会被破解，这些机制还是有意义的，它的意义在于增加破解难度，加壳、混淆都是一样的，不会因为「在 client 端的东西一定会被看穿」而不去做这些机制。

重点在于你想保护的商业逻辑的价值，有没有高到你需要付出这些成本去做额外的安全机制。

很多人在讨论这个问题的时候，没有办法把「单一问题」跟「最佳实践」切开来看，总是在讨论着「以成本来说，怎样怎样才是最好的」或是「为什么不干脆怎样怎样」，但技术选型从来都不是一刀切的事情，最好的方案通常成本也较高，如果真的没有这么多的资源怎么办？是不是就需要选择次好且成本较低的方案？

不是只有最佳实践才叫做实践，技术是需要进行妥协的。

举个例子，把登入验证机制都换成 [Passkeys](https://developers.google.com/identity/passkeys?hl=zh-tw)，成本可能是 50，增加的安全性是 90。

把原本明文传输的密码先 hash，成本可能是 20，增加的安全性是 5。

尽管 Passkeys 的效益整体来说更高，但问题是有些公司可能现在就只有 20 个单位的资源。

我自己认为一位优秀的工程师不能只给得出最佳实践，而是必须针对有限资源的状况之下，给出各种不同的解法，因此这篇讨论的问题不是毫无意义的。把这个问题整理过一轮之后，自然而然就会出现许多成本不同，效益也不同的解法。

有多少资源，就做多少事。

最后，如果你需要一个条列式的简单结论，会是：

1.  无论如何，一定要先用 HTTPS
2.  可以的话，能用 Passkeys 当然是最好，少掉传统密码的一些问题
3.  如果你想要用很安全的方式验证密码，请参考 SRP（Secure Remote Password）协定
4.  若是上述都没有资源做的话，那在前端先把密码做加密或是 hash 后再发送，确实能够增加一点安全性，但同时还是会带来额外成本
5.  如果你是银行或需要较高的安全性，再来考虑要不要做这个，否则极大多数的状况下，你不需要这个机制就够安全了，资源投入在其他地方的效益会更大

若是对这个结论有不同意见，或是有在文章中发现哪些逻辑错误或技术错误，欢迎留言指正与讨论，感恩。

补充一下，这篇大多数从技术面来看，除此之外还可以从法遵面或是资安的实务经验来看，但这些面向我就零经验了。许愿一下有相关经验的人出来指点迷津，或许会有不同观点。