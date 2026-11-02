# 🗳️ Microvote

**LICENSE:** _GPLv3_

An audience response system for the BBC Micro:Bit

### Usage

Before running builds, ensure all dependancies are installed:

```sh
make install
```

Then build the artifacts with:

```sh
make build
```

Finally, run the automated tests (where applicable) with:

```sh
make test
```

Note: all `make` commands can be run with the `-j` flag to parallelize, i.e. `make -j8 build`
