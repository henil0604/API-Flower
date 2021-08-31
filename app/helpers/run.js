const VM = require('vm2').VM;


module.exports = async (code, exposed = { }) => {
    return new Promise(async resolve => {

        let sandbox = {
            setTimeout,
            setInterval,
            JSON,
            Math,
            Date,
            resolve: resolve,
            ...exposed
        }
        const vm = new VM({
            timeout: 25000,
            showErrors: false,
            sandbox,
        });

        code = `
            (async function () {
                try{
                    ${code}
                }catch(e){
                    return {
                        ____RETURN_TYPE_VM__: "error",
                        e
                    };
                }
            })()
        `

        const run = await vm.run(code);

        resolve(run);
    })
}