# Polykey

Polykey is a distributed secret sharing system. It helps you manage your
secrets, passwords, API keys and more. It is designed for both managing
personal secrets and infrastructural secrets. This means it can be used
interactively, or in automated fashion. Unlike hosted password managers,
it is "self-hosted", you keep your own secrets. However it is not an
"online" service, so it needs very little maintenance.

It is distributed and decentralised, and secrets are shared between
Polykey nodes. As a user, you can create multiple nodes for each of your
computing platforms, and backups are simply another Polykey node.

Polykey integrates Git, GnuPG, and Keybase.

It is written in JavaScript and intended to work cross-platform: Linux,
Mac, Windows, Android, iOS. It does not necessarily run in the browser.

The design of Polykey is still under flux. Below is currently the
proposal.

A Polykey node is just an encrypted tar archive. It is just state, not
code. One can launch a Polykey application targetting a specific node.
This node needs to be accessible, it can just be a local file path.

The encrypted tar archive represents a sort of virtual directory of
secrets. It is an indexed tar archive to allow random access.

Secrets are organised in flat repositories instead of a hierarchy. In order
to organise secrets, secrets are grouped into tags. This means it is
a sort of tag based filesystem. This is achieved through the use of
hardlinks.

A Polykey node is never decrypted on-disk, it always remains encrypted
on disk. It is only decrypted in-memory. This means we unpack the
archive into an in-memory filesystem. This enables us to maintain
portability between different platform behaviours with regards to
filesystem features such as support for hardlinks.

An important feature of Polykey is the ability to share secrets in a
distributed peer-to-peer style. Our foundation is to start with
a Git based synchronisation system. Secrets are managed as git
directories, which maintains version history of secrets as they
are updated. It is possible to then push to nodes that you control.
But for nodes that you don't control, you can allow other nodes to
pull your secret repositories

Sharing secrets is done through public & private key cryptography.
In order to share keys with another node, you need to know their
public key. For initial key discovery we rely on on keybase for
social proof and as an alternative to public key servers.

Each secret repository has its own version history. This means a
secret repository may contain multiple secrets. Each secret repository
is shared as a unit. It is probably recommended to keep a secret
repository for each secret.

Why would you share secrets? Beyond the basic issue of having a shared
API keys among several agents, or a shared password between users.
This also allows a basic form of capability based security. Where you
can create hierarchal networks of Polykey nodes, and subdivide secrets
into smaller Polykey nodes.

The result is that secrets are encrypted at rest, secrets are encrypted
at transmission, and they can be shared between users and infrastructure.
There's no need for a network unless you are sharing secrets. And you can
run a Polykey node out of a USB stick.

All of other bells and whistles of modern password managers can then be
built on top of this secure platform.

---

Current status:

* js-resource-counter - https://github.com/MatrixAI/js-resource-counter
* js-permaproxy - https://github.com/MatrixAI/js-permaproxy
* js-virtualfs - https://github.com/MatrixAI/js-virtualfs
* js-reference-pointer - https://github.com/MatrixAI/js-reference-pointer
* js-object-tagger - https://github.com/MatrixAI/js-object-tagger
* js-array-fixed - https://github.com/MatrixAI/js-array-fixed
* js-tree-order-index - https://github.com/MatrixAI/js-tree-order-index
* js-virtualgit - https://github.com/MatrixAI/js-virtualgit

The last 2 are still being developed.
