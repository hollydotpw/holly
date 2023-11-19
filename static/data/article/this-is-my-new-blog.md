<!--SUMMARY-START
{
  "id": 0,
  "thumbnail":
    "/img/thumbnail/0.jpg",
  "title": "This is my new blog",
  "excerpt":
    "After 4 years without a blog I decided to make a new one from scratch, to fill my blogless void. In this story I'm going to talk about: my history with blogs, what is the propuse of it and what technologies I used.",
  "timestamp": 1645848480925,
  "authorId": 0,
  "categoryId": 7
}
SUMMARY-END-->
In my life I had 3 blogs:
- The first one that I made was when I had only 10 years old (~2011) using [paginawebgratis.es](https://paginawebgratis.es) (I'm surprised that they still exists).
- Then in ~2015 I decided to replace it with a self-hosted wordpress instance with a heavily modified theme. In ~2018 I closed it for various reasons, the main one being that I was working in a version with the same theme made from scratch that I never finished.
- And now in ~2022 this one, I started working on it 2 weeks ago.

No, you aren't going to find a lot about the old blogs. I personally emailed and called the [Internet Archive](https://archive.org) to delete the snapshots of my blogs from their database.

So it has been 4 years without having my own blog. I'm going to fill the void with this one.

## About Holly
My favorite icon from the [fugue icon collection](https://p.yusukekamiyamane.com) gives the name to this blog "holly". I got familiar with it way back when I was browsing Taringa V4-V5. Since I like to stay anonymous most of the time I don't have a stable username so the pick was mostly random.

The main purpose of this blog is to showcase my skills -mostly software development since that's my strongest point- and talk about myself. In contrast to my previous blogs, this one is going to be more professional and not that political. You -the reader- won't be exposed to a lot of my rants or rambling. Another big difference is that the entirety of the blog will be written in English, since the most relevant (or interested at the topic at hand) speaks English and it's familiar with it regardless of their nationality.

## The technology
As I said before, this blog is going to be written and developed from scratch. I made my "own design" (more on that latter) and blog engine.

Holly is based on:
- [Typescript](https://www.typescriptlang.org): As the main programming language.
- [SCSS](https://sass-lang.com): As programming language for stylesheets.
- [Preact](https://preactjs.com): As the virtual dom framework.
- [Wouter](https://github.com/molefrog/wouter): As the router for the virtual dom framework.
- [PrismJS](https://prismjs.com/): For the syntax highlighting in the code snippets.
- [Twitchdown](https://gitlab.com/bytesnz/twitchdown): For rendering markdown. It's a [Snarkdown](https://github.com/developit/snarkdown) fork that outputs a jsx ast rather than crude html. I also made some modifications to it.
- [Cloudflare Workers](https://workers.cloudflare.com/): For hosting.

As you can see, I develop most of my software using libraries that are as lightweight as possible so I can have fast and unbloated software. Feel free to check the lighthouse score in a guest profile, you should expect a 95-100 score on desktop or mobile most of the time.

![The lighthouse score](/img/story/0/lighthouse.png)

However, there are a lot of things that I'd like to implement (like rss feeds or find a way to decentralize using [IPFS](https://ipfs.io) or [ZeroNet](https://zeronet.io)). I'm going to work on this in the following weeks.

## The design
I'm a software engineer. Not a designer. I only just try to make my projects look about ok. I took some inspiration from [Medium](https://medium.com), I really love their design.

One of the main "controversial" things I'm doing at the moment is justifying my text. A lot of designers hate to do so. I don't get the hate.

I used the following things for design:
- [Spline Sans](https://fonts.google.com/specimen/Spline+Sans): As the main font.
- [PragmataPro](https://fsd.it/shop/fonts/pragmatapro): As the font for the code snippets.
- [Fudgue icon collection](https://p.yusukekamiyamane.com): For the logo and categories.
- [Medium](https://medium.com): As my inspiration.

## Closing thoughts
I have my new blog working and deployed after 2 weeks of work. I used every lightweight library that I know of. And finally I am happy to fill my blogless void. 

Have a nice week!