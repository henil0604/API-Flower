const VM = require('vm2').VM;


module.exports = async (code, exposed = {}) => {
    return new Promise(async resolve => {

        let sandbox = {
            console,
            setTimeout,
            setInterval,
            JSON,
            Math,
            ...exposed
        }
        const vm = new VM({
            console: 'inherit',
            timeout: 25000,
            showErrors: false,
            sandbox,
            done: resolve
        });

        code = `
            (async function () {
                try{
                    ${code}
                }catch(e){
                    return e;
                }
            })()
        `

        const run = vm.run(code);

        resolve(run);
    })
}