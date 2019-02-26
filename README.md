# nexrender-action-handbrake

## Installation

Install the module via Git :
```
npm i -g https://github.com/HarryLafranc/nexrender-action-handbrake
```

## Usage

The output can be relative or absolute. If it's relative, the workpath will be added.
If the output is not specified, the filename "encoded.mp4" will be used.

You can add the 'debug' option to see the progress of handbrake processing. (default: false)

The 'eraseInput' option will erase the original video input after the processing. (default: false)

```
actions:{
    postrender:[{
        module: "nexrender-action-handbrake",
        output: "my-encoded-video.mp4",
        debug: true,
        eraseInput: true
    }]
},
```
