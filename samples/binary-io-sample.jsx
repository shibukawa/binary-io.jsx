import "console.jsx";
import "js/nodejs.jsx";
import "binary-io.jsx";

class _Main {
    static function main(argv : string[]) : void
    {
        if (argv[0] == 'load')
        {
            var input = new BinaryInput(node.fs.readFileSync(argv[1], 'utf16le'));
            // Call method in same order of output
            console.log(input.loadString());
            console.log(input.load32bitNumber());
        }
        else if (argv[0] == 'dump')
        {
            var output = new BinaryOutput();
            output.dumpString("Tokyo");
            output.dump32bitNumber(12000000);
            node.fs.writeFileSync(argv[1], output.result(), 'utf16le');
        }
    }
}
