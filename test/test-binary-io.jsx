import "test-case.jsx";
import "binary-io.jsx";
import "console.jsx";

class _Test extends TestCase
{
    function test_16bit_number() : void
    {
        var output1 = new BinaryOutput();
        output1.dump16bitNumber(0);
        var input1 = new BinaryInput(output1.result());
        this.expect(input1.load16bitNumber()).toBe(0);

        var output2 = new BinaryOutput();
        output2.dump16bitNumber(65535);
        var input2 = new BinaryInput(output2.result());
        this.expect(input2.load16bitNumber()).toBe(65535);

        var output3 = new BinaryOutput();
        output3.dump16bitNumber(65536);
        var input3 = new BinaryInput(output2.result());
        this.expect(input3.load16bitNumber()).notToBe(65536);
    }

    function test_32bit_number() : void
    {
        var output1 = new BinaryOutput();
        output1.dump32bitNumber(0);
        var input1 = new BinaryInput(output1.result());
        this.expect(input1.load32bitNumber()).toBe(0);

        var output2 = new BinaryOutput();
        output2.dump32bitNumber(4294967295);
        var input2 = new BinaryInput(output2.result());
        this.expect(input2.load32bitNumber()).toBe(4294967295);

        var output3 = new BinaryOutput();
        output3.dump32bitNumber(4294967296);
        var input3 = new BinaryInput(output3.result());
        this.expect(input3.load32bitNumber()).notToBe(4294967296);
    }

    function test_string() : void
    {
        var output1 = new BinaryOutput();
        output1.dumpString('hello world');
        var input1 = new BinaryInput(output1.result());
        this.expect(input1.loadString()).toBe('hello world');

        // 7bit safe charactes will be compressed
        this.expect(output1.result().length).toBeLE('hello world'.length);

        var output2 = new BinaryOutput();
        output2.dumpString('');
        this.expect(output2.result().length).toBe(''.length + 1);

        // 7bit unsafe charactes will not be compressed
        var output3 = new BinaryOutput();
        output3.dumpString('\u1111\u1111');
        this.expect(output3.result().length).toBe('\u1111\u1111'.length + 1);
    }

    function test_string_list() : void
    {
        var output1 = new BinaryOutput();
        output1.dumpStringList(['hello', 'world']);
        var input1 = new BinaryInput(output1.result());
        var result1 = input1.loadStringList();
        this.expect(result1[0]).toBe('hello');
        this.expect(result1[1]).toBe('world');

        var output2 = new BinaryOutput();
        output2.dumpStringList(['\u1112', '\u1112']);
        var input2 = new BinaryInput(output2.result());
        var result2 = input2.loadStringList();
        this.expect(result2[0]).toBe('\u1112');
        this.expect(result2[1]).toBe('\u1112');
    }

    function test_string_list_map() : void
    {

        var src = {'hello': ['HELLO'], 'world': ['WORLD']};

        var output = new BinaryOutput();
        output.dumpStringListMap(src);
        var input = new BinaryInput(output.result());
        var result = input.loadStringListMap();
        this.expect(result['hello'][0]).toBe('HELLO');
        this.expect(result['world'][0]).toBe('WORLD');
    }

    function test_32bit_number_list_blank() : void
    {
        var list = [0, 0, 0, 0, 0, 0];

        var output = new BinaryOutput();
        output.dump32bitNumberList(list);
        this.expect(output.result().length).toBe(2 + 1);

        var input = new BinaryInput(output.result());
        var result = input.load32bitNumberList();
        this.expect(result.length).toBe(6);
        this.expect(result[0]).toBe(0);
        this.expect(result[5]).toBe(0);
        this.expect(input._offset).toBe(2 + 1);
    }

    function test_32bit_number_list_non_blank() : void
    {
        var list = [1, 1, 1, 1, 1, 1];

        var output = new BinaryOutput();
        output.dump32bitNumberList(list);
        this.expect(output.result().length).toBe(2 * 6 + 2 + 1);

        var input = new BinaryInput(output.result());
        var result = input.load32bitNumberList();
        this.expect(result.length).toBe(6);
        this.expect(result[0]).toBe(1);
        this.expect(result[5]).toBe(1);
        this.expect(input._offset).toBe(2 * 6 + 2 + 1);
    }

    function test_32bit_number_list_zebra() : void
    {
        var list = [1, 0, 1, 0, 1, 0];

        var output = new BinaryOutput();
        output.dump32bitNumberList(list);
        this.expect(output.result().length).toBe(2 * 3 + 2 + 1);

        var input = new BinaryInput(output.result());
        var result = input.load32bitNumberList();
        this.expect(result.length).toBe(6);
        this.expect(result[0]).toBe(1);
        this.expect(result[1]).toBe(0);
        this.expect(result[2]).toBe(1);
        this.expect(result[3]).toBe(0);
        this.expect(result[4]).toBe(1);
        this.expect(result[5]).toBe(0);
        this.expect(input._offset).toBe(2 * 3 + 2 + 1);
    }

    function test_32bit_number_list_combo1() : void
    {
        // non-blank + blank
        var list = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0];

        var output = new BinaryOutput();
        output.dump32bitNumberList(list);
        this.expect(output.result().length).toBe(2 + 1 + 2 * 17 + 1);

        var input = new BinaryInput(output.result());
        var result = input.load32bitNumberList();
        this.expect(result.length).toBe(list.length);
        this.expect(result[0]).toBe(1);
        this.expect(result[15]).toBe(1);
        this.expect(result[17]).toBe(0);
        this.expect(result[19]).toBe(0);
        this.expect(input._offset).toBe(2 + 1 + 2 * 17 + 1);
    }

    function test_32bit_number_list_combo2() : void
    {
        // blank + non-blank
        var list = [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];


        var output = new BinaryOutput();
        output.dump32bitNumberList(list);
        this.expect(output.result().length).toBe(2 + 1 + 1 + 2 * 17);

        var input = new BinaryInput(output.result());
        var result = input.load32bitNumberList();
        this.expect(result.length).toBe(list.length);
        this.expect(result[0]).toBe(0);
        this.expect(result[2]).toBe(0);
        this.expect(result[3]).toBe(1);
        this.expect(result[19]).toBe(1);
        this.expect(input._offset).toBe(2 + 1 + 1 + 2 * 17);
    }

    function test_32bit_number_list_combo3() : void
    {
        // non-blank + zebra
        var list = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0];

        var output = new BinaryOutput();
        output.dump32bitNumberList(list);
        this.expect(output.result().length).toBe(2 + 1 + 2 * 16 + 1 + 1 + 2 * 3);

        var input = new BinaryInput(output.result());
        var result = input.load32bitNumberList();
        this.expect(result.length).toBe(list.length);
        this.expect(result[0]).toBe(1);
        this.expect(result[9]).toBe(1);
        this.expect(result[16]).toBe(0);
        this.expect(result[18]).toBe(1);
        this.expect(input._offset).toBe(2 + 1 + 2 * 16 + 1 + 1 + 2 * 3);
    }

    function test_32bit_number_list_combo4() : void
    {
        // zebra + non-block
        var list = [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2];

        var output = new BinaryOutput();
        output.dump32bitNumberList(list);
        this.expect(output.result().length).toBe(2 + 1 + 2 * 11 + 1 + 2 * 16);

        var input = new BinaryInput(output.result());
        var result = input.load32bitNumberList();
        this.expect(result.length).toBe(list.length);
        this.expect(result[0]).toBe(1);
        this.expect(result[14]).toBe(0);
        this.expect(result[15]).toBe(1);
        this.expect(result[30]).toBe(2);
        this.expect(input._offset).toBe(2 + 1 + 2 * 11 + 1 + 2 * 16);
    }

    function test_32bit_number_list_combo5() : void
    {
        // zero + zebra
        var list = [0, 0, 0, 0, 0, 0, 1];

        var output = new BinaryOutput();
        output.dump32bitNumberList(list);
        this.expect(output.result().length).toBe(2 + 1 + 1 + 2);

        var input = new BinaryInput(output.result());
        var result = input.load32bitNumberList();
        this.expect(result.length).toBe(list.length);
        this.expect(result[0]).toBe(0);
        this.expect(result[6]).toBe(1);
        this.expect(input._offset).toBe(2 + 1 + 1 + 2);
    }

    function test_32bit_number_list_combo6() : void
    {
        // zebra + zero
        var list = [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        var output = new BinaryOutput();
        output.dump32bitNumberList(list);
        this.expect(output.result().length).toBe(2 + 1 + 2 * 12 + 1);

        var input = new BinaryInput(output.result());
        var result = input.load32bitNumberList();
        this.expect(result.length).toBe(list.length);
        this.expect(result[0]).toBe(1);
        this.expect(result[14]).toBe(1);
        this.expect(result[15]).toBe(0);
        this.expect(result[23]).toBe(0);
        this.expect(input._offset).toBe(2 + 1 + 2 * 12 + 1);
    }
}
