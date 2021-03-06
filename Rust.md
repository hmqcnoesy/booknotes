# Rust

Rust is compiled.  To create an exe:

```shell
rustc main.rs
```

Where `main.rs` contains a `main()` function, such as:

```rust
fn main() {
    println!("Hello, rust.");
}
```

The `!` character signifies a macro as opposed to a function call.

## Cargo 

Cargo is the crate (package) manager and build system for Rust.  To create a new Cargo project:

```shell
cargo new hello_cargo --bin
```

The `--bin` flag designates an exe target as opposed to a library.  Cargo will create a `hello_cargo` folder with the `.toml` (project info, dependencies list) file, a `.gitignore` file, and a `src` folder with a "hello world" `main.rs` file within.

To build the cargo project:

```shell
cargo build 
```

This will create the `target\debug` folder structure with an exe inside.

Alternatively, build and execute steps can be combined using the command:

```shell
cargo run
```

The `cargo build` and `cargo run` commands can use the `--release` flag to build a release version instead of a debug version.  A release version of the executable is saved in `target\release`.


## Simple example

```rust
use std::io;

fn main() {
    println!("Guess a number");  // intro
    let mut guess = String::new();
    io::stdin().read_line(&mut guess).expect("Failed to read line");
    println!("You guessed {}", guess);
}
```

The `io` library comes from the `std` standard library, and bringing it into scope requires the `use std::io` syntax.  Rust imports a few types into scope without explicit `use` statements - this list is known as the Rust "prelude". 

Rust comments are delimited by `//`. 

The `let` keyword is used to create a variable, which are immutable by default.  The `mut` keyword after `let` creates a mutable variable.  

The `String::new()` is a call to the `new()` function, which returns a new instance of the `String` type (UTF-8).  The `::` syntax indicates that `new` is an "associated function" of the type `String`, meaning the function is implemented on the type itself, rather than on an instance of the type (similar to `static` of other languages).

The call to `std::io::stdin()` (or simply `io::stdin()` because `use std::io` was included) returns an instance of `std::io::Stdin` which represents a handle to standard input.  The `read_line()` function on the `Stdin` object is called, which gets user input.  The `&mut guess` argument is the value modified by the `read_line` function.  The `&mut` indicates that the `guess` argument is passed by reference, so it can be modified within `read_line`.  Not only does `read_line` set the value of the passed variable, it returns an `io::Result`, which is an enum with possible variants `Ok` and `Err`.  A call to `expect` can be made on an instance of `io::Result`.  If the `io::Result` instance is an `Err` value, `expect` will cause the program to crash and display the message passed to it.  But in the example above, the `io::Result` will be an `Ok` value, and `expect()` returns the value contained by the result (in this case, just a count of the bytes in the `read_line` result).  Leaving the call to `expect()` out would cause a compiler warning, because Rust anticipates proper error handling on `Result` objects.

The call to `println!` can take an arbitrary number of paramters as replacement values for `{}` placeholders in the first string argument.  For example:

```rust
let x = 2;
let y = 3;
println!("x is {} and y is {}", x, y);
```


## Crates

Crates can be binaries (executable) or libraries.  To use a crate such as the `rand` crate for generating random numbers, modify the Cargo.toml file to include the crate name and version under the `[dependencies]`:

```
[dependencies]
rand = "0.3.14"
```

The "0.3.14" string is semantic versioning:  any version that is API compatible with 0.3.14 is acceptable. 

After modifying the Cargo.toml file, run again with `cargo run` and notice that `rand` and a `rand` dependency are downloaded from crates.io, and both are compiled before the local project.  Subsequent build processes will not download/compile the dependencies, because Cargo knows they are already available.  To update versions of dependencies automatically, use `cargo update`, which will update dependencies to the latest `z` in `x.y.z` (to update series' versions, manually edit Cargo.toml).  

To use the `rand` crate in code:

```rust
extern crate rand;
use rand::Rng;
let r_number = rand::thread_rng().gen_range(1,101);
```

The `extern crate rand` line indicates use of an external dependency, and also implicitly does the same thing as `use rand;`, so that doesn't need to be explicitly stated.  

The `use rand::Rng` imports the `Rng` trait, which defines methods for random number generators.  It must be in scope to use the RNG methods.

The call to the associated function `rand::thread_rng()` returns a random number generator (one that is local to the current thread, and seeded by the OS).  The `gen_range()` method on the RNG was brought into scope via importing the `Rng` trait.  The method takes two arguments, and returns a random number >= the first, and < the second.

Cargo can generate HTML documentation for all a projects' dependencies, via `cargo doc`.  The docs are placed in `target\doc`.  The `--open` flag will open the docs in the default program for .html files after they're generated.