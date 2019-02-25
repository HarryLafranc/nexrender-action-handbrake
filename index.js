const {name}  = require('./package.json')
const hbjs = require('handbrake-js');

module.exports = (job, settings, options, type) => {
    if (type != 'postrender') {
        throw new Error(`Action ${name} can be only run in postrender mode, you provided: ${type}.`)
    }

    settings.logger.log(`[${job.uid}] starting action-handbrake action`)

    return new Promise((resolve, reject) => {
        // Handbrake
        let input = options.input || job.output;

        hbjs.spawn({ input: input, output: options.output })
            .on('error', err => {
                // invalid user input, no video found etc
                console.log(err);
                return reject(new Error('Error in action-handbrake module'));
            })
            .on('progress', progress => {
                console.log(
                    'Percent complete: %s, ETA: %s',
                    progress.percentComplete,
                    progress.eta
                )
            })
            .on('end', () => {
                resolve(job);
            })
        });
}
