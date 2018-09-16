Now that I've decided to keep tree order index on the back burner for now.

I'm just going to try to use the isomorphic-git instead.

The tree order index is probably more relevant to architect instead.

If I can get the main implementation correct that would be good. But it's difficutl to do the more composite functions. Although you were doing the merge operations etc.

Oh yea you explored XML and tree encodings.

Remember how you started with trying out isomorphic git and you stopped cause you wanted your own FS and other stuff. Parsing semi structured data and stuff like that.

So for this project since we are not developing js-virtualgit. We need to explore the usage of isomorphic git.

Should we first have polykey lib. And then polykey app. So that way we can have something a bit more simple.

What do we call it?

We could call it `js-polykey`, since it's implemented js. It's the polykey library. But the application could also be installed via npm? Not really it's got a more complicated installation method.

Right now it needs to use `js-virtualfs` and `isomorphic-git`. No more `js-virtualgit`. We will also need a gnupg! The library is Apache license. The UI is GPL.
