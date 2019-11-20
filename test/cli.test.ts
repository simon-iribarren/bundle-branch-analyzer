import { parseArgumentsIntoOptions } from '../src/cli';

const BASE_ARGS = [
    '/usr/bin/node',
    '/usr/lib/node_modules/bundle-branch-analyzer.js',
]


describe('cli', () => {
    describe('should parse single arguments', () => {
        it('--targetBranch to targetBranch', () => {
            const parsedArgs = parseArgumentsIntoOptions([...BASE_ARGS, '--targetBranch', 'testArg'])
            expect(parsedArgs.targetBranch).toBe('testArg');
        })

        it('-t to targetBranch', () => {
            const parsedArgs = parseArgumentsIntoOptions([...BASE_ARGS, '-t', 'testArg'])
            expect(parsedArgs.targetBranch).toBe('testArg');
        })

        it('--mode to mode', () => {
            const parsedArgs = parseArgumentsIntoOptions([...BASE_ARGS, '--mode', 'testArg'])
            expect(parsedArgs.mode).toBe('testArg');
        })

        it('-m to mode', () => {
            const parsedArgs = parseArgumentsIntoOptions([...BASE_ARGS, '-m', 'testArg'])
            expect(parsedArgs.mode).toBe('testArg');
        })

        it('--webpackConfig to webpackConfigScript', () => {
            const parsedArgs = parseArgumentsIntoOptions([...BASE_ARGS, '--webpackConfig', 'testArg'])
            expect(parsedArgs.webpackConfigScript).toBe('testArg');
        })

    })

    describe('should parse multiple arguments', () => {
        it('should parse 2 arguments correctly in different order', () => {
            const opts1 = parseArgumentsIntoOptions([...BASE_ARGS, '-t', 'branch', '--mode', 'modeArg'])
            const opts2 = parseArgumentsIntoOptions([...BASE_ARGS, '--mode', 'modeArg', '-t', 'branch',])

            expect(opts1.mode).toBe(opts2.mode)
            expect(opts1.targetBranch).toBe(opts2.targetBranch)
        })

        it('should parse 3 or more arguments correctly in different order', () => {
            const opts1 = parseArgumentsIntoOptions([...BASE_ARGS, '-t', 'branch', '--mode', 'modeArg', '--webpackConfig', 'webpackArg'])
            const opts2 = parseArgumentsIntoOptions([...BASE_ARGS, '--webpackConfig', 'webpackArg', '--mode', 'modeArg', '-t', 'branch',])
            const opts3 = parseArgumentsIntoOptions([...BASE_ARGS, '--mode', 'modeArg', '--webpackConfig', 'webpackArg', '-t', 'branch',])

            expect(opts1.mode).toBe(opts2.mode)
            expect(opts1.mode).toBe(opts3.mode)
            expect(opts2.mode).toBe(opts3.mode)
        })

        it('should keep the options structure', () => {
            const parsedArgs = parseArgumentsIntoOptions([...BASE_ARGS, '-t', 'branch', '--mode', 'modeArg', '--webpackConfig', 'webpackArg'])
            expect(parsedArgs).toMatchSnapshot();
        })


    })
});