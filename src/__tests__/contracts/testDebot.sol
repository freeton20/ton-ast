pragma ton-solidity >=0.46.0;
pragma AbiHeader expire;
pragma AbiHeader time;
pragma AbiHeader pubkey;
import "https://raw.githubusercontent.com/tonlabs/debots/main/Debot.sol";
import "https://raw.githubusercontent.com/tonlabs/DeBot-IS-consortium/main/Terminal/Terminal.sol";

contract Test is Debot{

    function start() public override {
        Terminal.print(0, 'test Debot');       
    }
    
    function getDebotInfo() public functionID(0xDEB) override view returns(
        string name, string version, string publisher, string key, string author,
        address support, string hello, string language, string dabi, bytes icon
    ) {
        name = "Test DeBot";
        version = "0.0.1";
        publisher = "publisher name";
        key = "How to use";
        author = "Author name";
        support = address.makeAddrStd(0, 0x000000000000000000000000000000000000000000000000000000000000);
        hello = "Hello, i am an test DeBot.";
        language = "en";
        dabi = m_debotAbi.get();
        icon = '';
    }
    
    function getRequiredInterfaces() public view override returns (uint256[] interfaces) {
        return [ Terminal.ID ];
    }     
}
