{ pkgs, ... }: {
  # Which nixpkgs channel to use.
  channel = "stable-23.11"; # Or "unstable"
  # Use https://idx.dev/reference/common-modules to add attributes.
  common = {
    # Enabled language support for javascript, typescript, and nodejs.
    javascript.enable = true;
    typescript.enable = true;
    nodejs.enable = true;
    # Enabled postgresql.
    services.postgresql.enable = true;
  };
  # Environment variables.
  env = {};
  # Search for packages using https://search.nixos.org/packages
  packages = [
    pkgs.nodejs_22
    pkgs.nodePackages.pnpm
    pkgs.nodePackages.firebase-tools
    pkgs.supabase-cli
  ];
  # Defines a script to run when a workspace is created.
  onCreate = {
    # Example: Adding a file to a workspace.
    # test-success = ''
    #   # Name of the file to create.
    #   filename="test-success.txt"
    #   # Content of the file.
    #   content="Hello from onCreate hook!"
    #   # Create the file.
    #   echo "$content" > "$filename"
    # '';
  };
  # Defines a script to run when a workspace is started.
  onStart = {
    # Example: Publishing a port.
    # server = {
    #   # Script to run.
    #   command = "npm run dev";
    #   # Name of the port to publish.
    #   name = "server";
    #   # Port number to publish.
    #   port = 3000;
    #   # Description of the port.
    #   description = "Web server for the application";
    #   # URL to open when the port is ready.
    #   open = "http://localhost:3000";
    # };
  };
  # Pinned Nixpkgs version.
  # Determined by the channel selected via `common.channel` option.
  nixpkgs = {
    # rev = "52e3e80afff4b16cc1c190e0950a9a79000ac065";
    # sha256 = "15g9ng7bg2v4Nl9i3wsc9v44zb30b6796k86fjn8m3zji9l30n80";
  };
  # IDX customizations.
  idx = {
    # The list of extensions to recommend to the user.
    # For more details, see https://idx.dev/reference/extensions
    extensions = [
      "dbaeumer.vscode-eslint"
      # "esbenp.prettier-vscode"
    ];
    workspace = {
      # Runs when a workspace is first created.
      onCreate = {
        default.openFiles = [
          "src/app/test-login/page.tsx"
        ];
      };
      # Runs when a workspace is (re)started.
      onStart = {
        # Example: Start a background task.
        # npm-install = "npm install";
      };
    };
    # Preview environments.
    previews = {
      # Enable previews by default.
      enable = true;
      # Include a script to run when a preview environment is created.
      onCreate = {
        # Example: Adding a file to a preview environment.
        # test-success = ''
        #   # Name of the file to create.
        #   filename="test-success.txt"
        #   # Content of the file.
        #   content="Hello from onCreate hook!"
        #   # Create the file.
        #   echo "$content" > "$filename"
        # '';
      };
    };
    # List of processes to run.
    # For more details, see https://idx.dev/reference/processes
    processes = {};
  };
}
