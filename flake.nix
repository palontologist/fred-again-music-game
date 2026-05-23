# flake.nix - NixOS Development Environment

{
  description = "Fred Again Music Game - Tauri Music Creation Tool";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    rust-overlay.url = "github:oxalica/rust-overlay";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, rust-overlay, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        overlays = [ (import rust-overlay) ];
        pkgs = import nixpkgs {
          inherit system overlays;
        };

        # Rust toolchain
        rust = pkgs.rust-bin.stable.latest.default.override {
          extensions = [ "rust-src" "rust-analyzer" ];
        };

        # Tauri build dependencies
        tauri-dependencies = with pkgs; [
          libxkbcommon
          libssl
          pkg-config
          protobuf
          openssl
          curl
          wget
          git
          
          # GTK and WebKit for UI rendering
          gtk3
          gtk4
          webkitgtk
          webkitgtk_4_1
          libsoup_3
          
          # Audio libraries
          alsa-lib
          pulseaudio
          jack2
          
          # Build tools
          cmake
          gcc
          libudev-zero
          
          # Optional: for better development
          just
          watchexec
        ];

        # Node.js for frontend
        nodejs = pkgs.nodejs_18;

      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            # Rust
            rust
            cargo-edit
            cargo-watch
            
            # Node/npm
            nodejs
            nodePackages.npm
            nodePackages.pnpm
            
            # Tauri dependencies
          ] ++ tauri-dependencies;

          shellHook = ''
            echo "🎵 Fred Again Music Game Development Environment"
            echo "=================================================="
            echo ""
            echo "Rust version:"
            rustc --version
            echo ""
            echo "Node version:"
            node --version
            echo ""
            echo "Available commands:"
            echo "  npm run tauri dev       - Start development server"
            echo "  npm run tauri build     - Build production binary"
            echo "  npm run dev             - Start Vite dev server only"
            echo "  cargo build             - Build Rust backend"
            echo "  cargo test              - Run Rust tests"
            echo ""
            
            # Set environment variables for Tauri
            export PKG_CONFIG_PATH="${pkgs.gtk3}/lib/pkgconfig:${pkgs.gtk4}/lib/pkgconfig:${pkgs.openssl}/lib/pkgconfig"
            export LD_LIBRARY_PATH="${pkgs.lib.makeLibraryPath [
              pkgs.libxkbcommon
              pkgs.libssl
              pkgs.gtk3
              pkgs.gtk4
              pkgs.webkitgtk
              pkgs.libsoup_3
              pkgs.cairo
              pkgs.glib
            ]}:$LD_LIBRARY_PATH"
            
            # For WebKit to work properly
            export WEBKIT_EXEC_PATH="${pkgs.webkitgtk}/libexec"
          '';
        };

        # Build the application
        packages.default = pkgs.rustPlatform.buildRustPackage {
          pname = "fred-again-music-game";
          version = "0.1.0";
          
          src = ./.;
          
          cargoLock = {
            lockFile = ./src-tauri/Cargo.lock;
          };
          
          buildInputs = tauri-dependencies ++ [ rust ];
          nativeBuildInputs = with pkgs; [ pkg-config ];
          
          preBuild = ''
            npm ci
            npm run build
          '';
          
          installPhase = ''
            mkdir -p $out/bin
            cp target/release/fred-again-music-game $out/bin/
          '';
        };
      }
    );
}
