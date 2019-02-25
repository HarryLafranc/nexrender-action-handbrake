const {name}  = require('./package.json')
const hbjs = require('handbrake-js');
const path    = require('path')

module.exports = (job, settings, options, type) => {
    if (type != 'postrender') {
        throw new Error(`Action ${name} can be only run in postrender mode, you provided: ${type}.`)
    }

    settings.logger.log(`[${job.uid}] starting action-handbrake action`)

    return new Promise((resolve, reject) => {
        // Handbrake
        let input = options.input || job.output;
        let output, filename;

        if(options.output){
            output = options.output;
        }
        else{
            // if there is no output specified, we use outputFilename
            // (or 'encoded' by default) and outputExt as the extension
            // (or mp4 by default)
            filename = `${options.outputFilename || "encoded"}.${options.outputExt || "mp4"}`;

            output = path.join(job.workpath, filename);
        }

        if(options.debug){
            settings.logger.log(`[${job.uid}] [action-handbrake] output is set to ${output}`)
        }

        hbjs.spawn({ input: input, output: options.output })
            .on('error', err => {
                // invalid user input, no video found etc
                if(options.debug){
                    console.log(err);
                }
                return reject(new Error('Error in action-handbrake module'));
            })
            .on('progress', progress => {
                if(options.debug){
                    console.log(
                        `[${job.uid}] [action-handbrake] percent complete : ${progress.percentComplete}, ETA: ${progress.eta}`
                    )
                }
            })
            .on('end', () => {
                resolve(job);
            })
        });
}
