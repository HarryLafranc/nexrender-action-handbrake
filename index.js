const {name}  = require('./package.json')
const hbjs = require('handbrake-js');
const path = require('path')
const fs = require('fs')

module.exports = (job, settings, options, type) => {
    if (type != 'postrender') {
        throw new Error(`Action ${name} can be only run in postrender mode, you provided: ${type}.`)
    }

    settings.logger.log(`[${job.uid}] starting action-handbrake action`)

    return new Promise((resolve, reject) => {
        let input = options.input || job.output;
        let output = options.output || "encoded.mp4";

        if (!path.isAbsolute(input)) input = path.join(job.workpath, input);
        if (!path.isAbsolute(output)) output = path.join(job.workpath, output);

        if(options.debug){
            settings.logger.log(`[${job.uid}] [action-handbrake] output is set to ${output}`)
        }

        hbjs.spawn({ input: input, output: output })
            .on('error', err => {
                // invalid user input, no video found etc
                if(options.debug){
                    console.log("Error with action-handbrake")
                    console.log(err);
                }
                return reject(new Error('Error in action-handbrake module'));
            })
            .on('progress', progress => {
                if(options.debug){
                    settings.logger.log(
                        `[${job.uid}] [action-handbrake] percent complete : ${progress.percentComplete}, ETA: ${progress.eta}`
                    )
                }
            })
            .on('complete', complete => {
                if(options.eraseInput){
                    settings.logger.log(`[${job.uid}] [action-handbrake] erasing input ${input}`)
                    fs.unlinkSync(input)
                }

                settings.logger.log(`[${job.uid}] [action-handbrake] encoding complete`)
                resolve(job);
            })
        });
}
