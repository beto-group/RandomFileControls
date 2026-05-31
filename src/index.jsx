const { useState, useEffect } = dc;

// Load the coordinator component
const { App } = await dc.require(dc.resolvePath("RANDOM FILE CONTROLS/src/App.jsx"));

function Index() {
    const [reloadKey, setReloadKey] = useState(0);

    // Polling watch daemon for cache invalidation
    useEffect(() => {
        let interval;
        const checkCommand = async () => {
            try {
                const cmdPath = dc.resolvePath("RANDOM FILE CONTROLS/data/mcp_commands.json");
                const stat = await dc.app.vault.adapter.stat(cmdPath);
                if (stat) {
                    const content = await dc.app.vault.adapter.read(cmdPath);
                    const data = JSON.parse(content);
                    if (data.action === "reload" && !data.executed) {
                        data.executed = true;
                        await dc.app.vault.adapter.write(cmdPath, JSON.stringify(data, null, 2));
                        setReloadKey(prev => prev + 1);
                    }
                }
            } catch (e) {
                // Ignore missing file errors
            }
        };
        interval = setInterval(checkCommand, 1000);
        return () => clearInterval(interval);
    }, []);

    return <App key={reloadKey} />;
}

return { Index };
