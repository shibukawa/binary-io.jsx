import "test-case.jsx";
import "js/nodejs.jsx";
import "binary-io.jsx";
import "console.jsx";

/**
 * testdata.bin is created in the folowing step on oktavia.py's binaryio.py.
 *
 * This file should be able to load by this module.
 *
 * output.dump_16bit_number(0)
 * output.dump_16bit_number(65535)
 * output.dump_32bit_number(0)
 * output.dump_32bit_number(4294967295)
 * output.dump_string("hello world")
 * output.dump_string_list(['hello', 'world'])
 * output.dump_string_list_map({'hello': ['HELLO'], 'world': ['WORLD']})
 * output.dump_32bit_number_list([0, 0, 0, 0, 0])
 */

class _Test extends TestCase
{
    var input : BinaryInput;

    override function setUp() : void
    {
        var filepath = node.path.join(node.__dirname, 'test/testdata.bin');
        this.input = new BinaryInput(node.fs.readFileSync(filepath, 'utf16le'));
    }

    function test_read_data_exported_on_python() : void
    {
        this.expect(this.input.load16bitNumber()).toBe(0);
        this.expect(this.input.load16bitNumber()).toBe(65535);
        this.expect(this.input.load32bitNumber()).toBe(0);
        this.expect(this.input.load32bitNumber()).toBe(4294967295);
        this.expect(this.input.loadString()).toBe('hello world');
        var list = this.input.loadStringList();
        this.expect(list.length).toBe(2);
        this.expect(list[0]).toBe('hello');
        this.expect(list[1]).toBe('world');
        var listMap = this.input.loadStringListMap();
        this.expect(listMap['hello'][0]).toBe('HELLO');
        this.expect(listMap['world'][0]).toBe('WORLD');
        var numList = this.input.load32bitNumberList(); 
        this.expect(numList.length).toBe(5);
        this.expect(numList[0]).toBe(0);
        this.expect(numList[4]).toBe(0);
    }
}
