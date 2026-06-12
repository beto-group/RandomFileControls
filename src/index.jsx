async function View({ folderPath, dc }) {
    if (!folderPath) throw new Error("View requires folderPath prop");
    dc.currentFolderPath = folderPath;

    function SafeRoot() {
        const [appComponent, setAppComponent] = dc.useState(null);
        const [reloadKey, setReloadKey] = dc.useState(0);

        // Polling watch daemon for cache invalidation
        dc.useEffect(() => {
            let interval;
            const checkCommand = async () => {
                try {
                    const cmdPath = folderPath + "/data/mcp_commands.json";
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

        dc.useEffect(() => {
            const load = async () => {
                try {
                    const appPath = folderPath + '/src/App.jsx';
                    const { App } = await dc.require(appPath);
                    setAppComponent({ App });
                } catch (e) {
                    console.error("Failed to load Random File Controls component:", e);
                }
            };
            load();
        }, [reloadKey]);

        if (!appComponent) {
            return (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                    Loading Random File Controls...
                </div>
            );
        }

        const { App } = appComponent;
        return <App folderPath={folderPath} dc={dc} />;
    }

    return <SafeRoot />;
}

return { View };
