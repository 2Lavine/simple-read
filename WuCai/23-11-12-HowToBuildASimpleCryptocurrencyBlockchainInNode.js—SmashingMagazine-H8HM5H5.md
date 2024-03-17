%%begin highlights%%
The term blockchain has earned its name because of the manner it keeps transaction data, i.e. in blocks that are connected to each other to create a chain.

Besides the transaction data, every block may contain its own cryptographic hash (a unique identifier or digital footprint), its own nonce value (an arbitrary random number used once in cryptographic computations), the hash of the previous block, and a timestamp of recent authenticated transactions.

Since every new block should point to the previous block, if a block is incorporated into the chain without containing the right hash of the last block, it could render the entire blockchain invalid.

The main idea of proof work is that any participant in the blockchain network should find this number difficult to identify but easily verifiable. Consequently, it discourages spamming and tampering with the structure of the blockchain.

Consequently, any person who proves that they’ve done work by solving this problem is compensated with a digital currency, in a process referred to as “mining”.

the blockchain technology is based on the concept that all the blocks are chained to one another. So, let’s create a CryptoBlockchain class that will be responsible for handling the operations of the entire chain

I’ll add a random nonce value to every hashed block such that, when rehashing takes place, the difficulty level restrictions can still be met.

%%end highlights%%

!!!PAGE NOTE!!!
%%begin pagenote%%

%%end pagenote%%

 #五彩插件 [原文](https://www.smashingmagazine.com/2020/02/cryptocurrency-blockchain-node-js/)
更新时间: 2023-11-12 13:25