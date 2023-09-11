我日常翻译字幕时，第一件事是要将视频的字幕识别出来，用的最多的还是 WhisperX ，但我是Mac电脑没有GPU加速，所以没法直接用 WhisperX，好在有Google Colab，免费够用。

我常用的场景主要有两种：
1. YouTube视频提取字幕
2. 其他来源的视频文件提取字幕

我为此写了两个不同的Notebooks，在我的GitHub都有下载：
github.com/JimLiu/whisper-subtitles

基本用法

1. 从GitHub下载你要用的Nodebook文件，扩展名是 .ipynb 
2. 注册登录 Google Colab，免费版是够用的 colab.research.google.com
3. 从菜单的 file -> upload notebook 打开上传界面
4. 上传你下载好的Notebook，也就是.ipynb 
提取YouTube字幕的这个Notebook很简单：
github.com/JimLiu/whisper-subtitles/blob/main/whisperx_youtube_subtitle.ipynb
1. 复制粘贴你要提取字幕的YouTube视频地址在右边的输入框（参考图三）
2. 其他参数可选，Prompt参数我经常用，因为它可以帮助更好的识别一些专有名词，比如ChatGPT。
3. 从菜单中选择 Runtime - Run all
4. 完成后会自动下载
注意除了 srt 文件外，我还下载了json文件，这个对大多数人没有用，不过对我自己很重要，可以无视这个文件。

另一个本地上传视频文件的Notebook稍微麻烦一点，要从左侧把视频文件上传上去，一定要等上传完了才能执行最后一步。
github.com/JimLiu/whisper-subtitles/blob/main/whisperx_for_uploading_file.ipynb

如果想要节约一点时间的话，就可以在上传文件的同时，先安装WhisperX（图7）

嫌麻烦就可以等文件上传好了直接 Run All

参数的话可能你需要修改一下语言或者Prompt帮你识别专有名词 

如果是中文的话，在language参数里面输入“zh”，如果要区分简体繁体，在Prompt里面加一点文字和标点符号引导一下应该就可以。

英语的话，medium.en 模型速度会快一点点，中文的话还是选择large-v2