%%begin highlights%%
Inscriptions(题词) inscribe sats with arbitrary content, creating bitcoin-native digital artifacts, more commonly known as NFTs. Inscriptions(题词) do not require a sidechain or separate token.

These inscribed sats can then be transferred using bitcoin transactions, sent to bitcoin addresses, and held in bitcoin UTXOs.

An inscription consists of a content type, also known as a MIME type, and the content itself, which is a byte string

Inscription content is entirely on-chain, stored in taproot script-path spend scripts

OP_PUSH 1 indicates that the next push contains the content type, and OP_PUSH 0indicates that subsequent data pushes contain the content itself.

%%end highlights%%

!!!PAGE NOTE!!!
%%begin pagenote%%

%%end pagenote%%

 #五彩插件 [原文](https://docs.ordinals.com/inscriptions.html#inscriptions)
更新时间: 2023-11-18 13:17