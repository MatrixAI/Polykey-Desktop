PolyKey
=======

gpg --gen-key

gpg --gen-revoke --armor --output=RecovationCertificate.asc email@address

There are keyservers that identify users to keys. Wait isn't that what keybase is? A keyserver basically. Except not only for PGP keys but other keys as well, well it's like an identity server.

There's a keyserver called pgp.mit.edu. The major keyservers mirror each other, so you can get it from a keyserver of your choice.

You can browse keys there.

gpg --keyserver pgp.mit.edu --search-keys email@address

It still seems that emails are used to identify people in the real world. But... keybase tries to do this with any major social network.

The search keys uses substring search.

Once you identify the key you want to import, you can then do

gpg --keyserver pgp.mit.edu --recv-keys ...

Where ... is the key fingerprint.

sks-keyservers.net monitors the status of keyservers in real time, but it's often down.

Once you have uploaded a pub key to a key server (event github is a keyserver, since you can get people's pub key via github user API). You can then upload the revocation certificate to a keyserver to revoke your key on the public place.

Wait how does that prevent your pub key from being used? other people who used your pub key may still have it, and can allow access via your private key.

Revocation keys needs to be protected just like secret keys. So it's the same.

Listen carefully. This is important. Anyone can generate a public key for any e-mail address. Anyone can post that key to any key server. Only by verifying that the key really belongs to the person you think it does does it give you any security. Without this crucial verification, all that your cryptographic software does is ensures that bits weren't corrupted during transmission, and prevents casual observers from reading the message. It does not mean that you're talking to who you think you are. You could be talking to someone else entirely (a bad guy,) or you could be subject to a man-in-the-middle attack.

Verification is a out-of-band process, but then keybase facilitates this somewhat by using major social profiles, and proof by social networks to verify if the key you have the real person.

Our new polykey should make use of keybase API (with pinned certificate to check if the keys match the real identity!)

Instead of fully comparing  the pub keys, we can compare fingerprints which are shorter.

A fingerprint is a short usually expressed as 40-hexadecimal digit number (ooo we can use this for the folder tag representation). It's a crypto hash of the public key.

You can get the fingerprint of a key using:

gpg --fingerprint email@address

After importing someone's key, you can sign their key.

gpg --sign-key email@address

This appears to show that you "trust" the key somewhat. It basically assigns into the gpg database the key trust rating. The signature itself can be exported, and someone else can then import that signature. I'm not sure what the point of importing a signature really is though.

gpg --export --armor email@address

There's no point signing your own key, its already signed.

Alternatively you can locally sign the key with:

gpg --lsign-key email@address

You're not meant to sign someone else's key unless you verify them.

Keyservers are not meant to allow deletion, so basically once you send a pub key, you cannot delete it. Instead you must generate a revocation certificate for that key and send it over to revoke it. So everytime you upload a pub key to a keyserver, you must also keep the revocation certificate safe (if you lose your private key), then you will never be able to delete the pub key.

Is there a protocol for these pgp pub keys?

gpg --armor --export is supposed to export your public key, without armor, you get binary data.

Web of trust also indicates that can transitively trust someone. So if you trust somebody they pass keys back to you.

Keyservers not only contain your own public key, but the keys that you signed, indicating that you trust/verified them.

gpg --send-keys KEYID

When you decrypt a file using gpg, as in

gpg ./filename

You get both the encrypted and decrypted versions of the file on disk. It is dangerous to have both versions at the same time, as it's possible for attackers to attack them with known plaintext and possibly derive the private key. One of the files must be deleted.

If you just want to see the contents of a decrypted file, use gpg -d ./filename. This will not save the file.

If you encrypt+sign:

gpg --encrypt --sign --armor -r ... ./filename

You get back ./filename.asc

You can then decrypt it with gpg ./filename.asc

However it asks to create the file ./filename

So it will ask to overwrite if there's already ./filename.

If you don't use --armor, instead it will generate ./filename.gpg.

Which is a binary version of the ascii.

In emails, if you generate ascii, you can copy paste into the body of the email. But if you just create the filename.gpg, you can put that as an attachment, and there's no problem.

What would be better is some sort of steganography, that puts that into the body of a message, and an extraction system. I wonder if that exists.

Each time you encrypt and decrypt, you've got to enter your password again, this is why it's good to use gpgagent and sshagent together. Perhaps that's why keychain exists.

For publically readable emails, you wouldn't encrypt, you'd just sign it. The verification of it has to do something like HMAC (hash + message). In the case of an email, that's an email attachment each time. That kind of makes it annoying, as every email now has an attachment. A smarter email would understand that and put it separate from emails normally. And putting it into the body is gross.

If you only want to sign the messsage use 

gpg --clearsign ./filename

or just read from stdin, it generates filename.asc normally as well

To verify the message

gpg --verify ./filename.asc

However signing a message in this way changes the message.

Instead we can detach sign it with:

gpg --detach-sign ./filename

And then verify the signature itself

gpg --verify filename.sig

You can also write a message anonymously with a anonymous pub key. Just create a new key without your name, publish that onto a keyserver and then produce messages using that.

You can periodically update all your keys with gpg --refresh-keys. This synchr
onises new keys from public key servers.

This ensures that the keys you're imported hasn't been revoked. So periodically you should run that command.

With regards to PolyKey, that means we need to integrate the revocation of old keys, and then reencrypt with the new key that it points to.

Signing a key is related to a web of trust procedure. Basically by signing someone else's key, you're saying you verified and trust that this key is the key of who the key claims to be part of. People can take this signed message and pass to other people, indiciating that them that someone else, a third party also trusts their own public key. If that person trusts the third party, then the third party is essentially a CA. In the case of keybase, the CA is a network of social profiles, all who claim to "sign" a particular public key. Also keybase's database is now replicated to the blockchain. Woot!

So in Polykey, when you import keys, you can elect to sign them.

It's possible to show all signatures

gpg --list-sigs email@address

It's possible to hide the recipients you're sending a message to using --hidden-recipient. Or you can use --throw-keyids to hide all recipients. This ensures that when the client must decrypt the message, they will try all key ids. This can also be useful for Polykey, when you want to share your keys with other users, but you don't want the sharing system to have a proper keyid. Note that the share tags are still there with their key signature, so your keynode still shows which keys are encrypted/shared with which recipient. But sharing the secrets can be hidden.

You can also use steganography by doing steghide, but not sure why this is needed for Polykey. Steghide an entire key database...

One important feature is the ability to pass revocation certificates, and the transition from shared pub key to another shared pub key.

Here's how to update your own key.

Generate the key with gpg --gen-key.

List your own keys with

gpg --list-secret-keys or gpg -K

Now you should show 2 or more keys, the old keys and the new key.

Create revocation certificate for the new key. (Always remember to store this somewhere, but Polykey doesn't handle this)

Sign the new key with your old key, this means people who have your old key, and trust the new key was generated by you.

gpg --local-user OLDKEYID --sign-key NEWKEYID

Then sign your old key's signed keys. Thus indicating that the new key trusts the keys you signed before.

gpg --local-user NEWKEYID --interactive --edit-key OLDKEYID

Set the new key as default. You can do it inside the gpg.conf. With `default-key NEWKEYID`.

At this point, if you really don't need the old key. You can delete the old key. But if you have ANYTHING encrypted with the old key, you won't be able to decrypt it, so it's kind of dangerous to eagerly garbage collect. Instead you can disable your old key with gpg --interactive --edit-key OLDKEYID, then you use the command disable followed by save. You can renable it with enable then save.

Then you need to tell everybody who has your old key.

gpg --local-user OLDKEYID --clearsign ./filename

THis means using the a message that says update to the new key please.

This is free form, so Polykey will need to create a key migration protocol, where this message is created, and upon a subsequent synchronisation action by another keynode, they would take this migration document and keep track of it. This could be in a folder of migrations and each migration can be acted upon if necessary.

Other people can then sign that key and return it back to you by publishing new keys on a keyserver, then you can use gpg --refresh-keys.

If people haven't updated, they may still send messages to your on your old key. This is why it's a good idea to keep your old key around. But once you no longer want to encrypt messages with the old key, use your revocation certificate and send it to the keyservers to revoke them.

To use someone else's new key.

Run gpg --import on the file.

Or gpg --refresh-keys can also get new keys as well.

When you do gpg --list-keys or gpg -k, this will show multiple keys for a user. The keys will be ordered by date.

Those new keys still need verification, we'll use keybase for this, and check new keys for verification.

Another important point is that the new key should be signed with the old key, and published onto the keyserver.

So then one should check it

gpg --check-sigs NEWKEYID

This will show with sig! which shows the old key id.

So I can see that there are multiple levels to this:

1. Get the new key
2. Verify the new key by checking keybase, and checking if it was signed with the old key (but if the old key was compromised, then the second check cannot be used) (keybase might not have been updated, and the keyservers may not be updated yet)
3. Switch over all encrypted keys in Polykey to the new key
4. Use the new fingerprint in your share symlinks
5. Sign the new key yourself (optional, not need to be done by Polykey)

Since this is not your key, you should be able to delete or disable the old key. (You don't really need it for other people's new keys)

gpg --delete-keys OLDKEYID

---

Symlinks need to work on Windows!

https://blogs.windows.com/buildingapps/2016/12/02/symlinks-windows-10/#fjxiQeQMQ3xm0gF5.97

New apps need to use this: SYMBOLIC_LINK_FLAG_ALLOW_UNPRIVILEGED_CREATE to make sure that windows understands that the app understands to create symlinks even without administrator mode. Perhaps powershell call out, or some sort of .NET API.

To be really portable, we need an alternative way to tag files or group files, an alternative to symlinks can be understanding text-link format, and just using that within Polykey. (Windows shortcuts? (but it requires environment variables to work, as there's no relative shortcutting mechanism)) 

Note that the KEYID is the last 8 hexadecimal characters of the fingerprint after removing spaces. A KEYID could also be used for names in our sharing mechanism instead of the full fingerprint. But there's a greater chance of duplication right? It depends on how many people one could be sharing.

gpg --send-keys KEYID will send that KEYID to the keyserver as well.

gpg --import is used for both importing pub keys, and importing signed pub keys.

Period cron for gpg --refresh-keys (although outside of scope of Polykey).

Best tutorial for gpg: https://futureboy.us/pgp.html

Entire fingerprint is always better, short keys can have at least 1 collision very 82000 keys.

To show your own fingerprint here are the ways:

gpg --key-id-format long --list-keys
gpg --fingerprint --with-colon email@address
gpg --fingerpring email@address

---

Finally the master key needs to be kept safely.

gpg --export-secret-key --armor

The master key shouldn't be stored in the same polykey keynode. Although you could store subkeys (or "other" master keys) into the polykey keynode.

Password protecting your master key inherently gives 2 factor authentication.

You also shouldn't store the master key along with your keynode in the same place.

Back up your keynode to different areas on the interwebs, while keep your master key in a separate area.

You could carry 2 USBs, one for the keynode, and another for the master key, where the keynode USB is used more often, but the master key USB is kept securely under physical lock.

---

The files for GPG 1 to backup are:

~/.gnupg/gpg.conf
~/.gnupg/pubring.gpg
~/.gnupg/secring.gpg

For GPG 2, there's

~/.gnupg/pubring.kbx
~/.gnupg/openpgp-revocs.d

Note that the trust database is in ~/.gnupg/trustdb.gpg but you don't need to back this up. Instead you should backup gpg --export-ownertrust. This gives you the list of keys to trust. Polykey should be able to take any of the keys in the trust database and use it for key sharing.

You can reimport the trust database by doing gpg --import-ownertrust.

It appears the main reason, is that the trustdb can be corrupted, but the this can recreate the trust database.

It seems that GPG2 auto generates revocation certificates for any private key you create, whereas GPG 1 needs to be prompted to create it.

Of course it seems that gpg.conf can be kept in the dotfiles clear, but pubring.gpg, secring.gpg and other databases should be considered secret. Otherwise you may end up leaking various information.

---

~/.keys/data
~/.keys/data/abc124gfdg8gj.tar
~/.keys/tags
~/.keys/share
~/.keys/share/72F28C3C7E70B2C48ABBE4A760C1FBE8E6B85B80/abc124gfdg8gj.tar

~/.keys/tags and .keys/share are all symlinks pointing back to data.

Maintain tar index, and symlink index?

Symlink index is just a linear scan of all tags and shares.

Tags and shares are differentiated as tags are just for organisation, whereas share is for sharing.

Share contains fingerprints.

One problem is that introduction that people must learn how to use gpg before polykey. And the incompatibilities of gpg and gpg2. Then it should work seamlessly with gpg and gpg2.

Try to haskell gpgme project.
