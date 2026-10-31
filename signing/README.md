# App signing key

`islenska-release.jks` is the permanent key every APK is signed with. Android only installs an update over an existing app when the key is the same.

The file is encrypted (PKCS#12, AES-256), and the password is **not** in this repo. The build reads it from the repository secret `ANDROID_KEYSTORE_PASSWORD`. Without that password the file is useless.

The owner should keep a backup of the file and its password, for example in a password manager. Both are also needed to publish on Google Play.
