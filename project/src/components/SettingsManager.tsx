import React, { useState, useEffect } from 'react';
import { Settings, Save, Trash2, Download, Upload, Eye, EyeOff } from 'lucide-react';
import { useGame } from '../contexts/GameContext';

interface SavedSetting {
  id: string;
  name: string;
  game: string;
  settings: any;
  createdAt: string;
  lastUsed?: string;
}

interface SettingsManagerProps {
  currentGame: string;
  currentSettings: any;
  onLoadSettings: (settings: any) => void;
  onSaveSettings: () => void;
}

const SettingsManager: React.FC<SettingsManagerProps> = ({
  currentGame,
  currentSettings,
  onLoadSettings,
  onSaveSettings
}) => {
  const { saveGameSettings, loadGameSettings } = useGame();
  const [savedSettings, setSavedSettings] = useState<SavedSetting[]>([]);
  const [showManager, setShowManager] = useState(false);
  const [newSettingName, setNewSettingName] = useState('');
  const [showSaveForm, setShowSaveForm] = useState(false);

  useEffect(() => {
    loadSavedSettings();
  }, [currentGame]);

  const loadSavedSettings = () => {
    const allSettings = JSON.parse(localStorage.getItem('charlies-odds-saved-settings') || '[]');
    const gameSettings = allSettings.filter((setting: SavedSetting) => setting.game === currentGame);
    setSavedSettings(gameSettings);
  };

  const saveNewSetting = () => {
    if (!newSettingName.trim()) return;

    const newSetting: SavedSetting = {
      id: `${currentGame}-${Date.now()}`,
      name: newSettingName.trim(),
      game: currentGame,
      settings: currentSettings,
      createdAt: new Date().toISOString(),
    };

    const allSettings = JSON.parse(localStorage.getItem('charlies-odds-saved-settings') || '[]');
    allSettings.push(newSetting);
    localStorage.setItem('charlies-odds-saved-settings', JSON.stringify(allSettings));

    setNewSettingName('');
    setShowSaveForm(false);
    loadSavedSettings();
  };

  const loadSetting = (setting: SavedSetting) => {
    onLoadSettings(setting.settings);
    
    // Update last used timestamp
    const allSettings = JSON.parse(localStorage.getItem('charlies-odds-saved-settings') || '[]');
    const updatedSettings = allSettings.map((s: SavedSetting) => 
      s.id === setting.id ? { ...s, lastUsed: new Date().toISOString() } : s
    );
    localStorage.setItem('charlies-odds-saved-settings', JSON.stringify(updatedSettings));
    loadSavedSettings();
  };

  const deleteSetting = (settingId: string) => {
    if (!confirm('Are you sure you want to delete this setting?')) return;

    const allSettings = JSON.parse(localStorage.getItem('charlies-odds-saved-settings') || '[]');
    const filteredSettings = allSettings.filter((s: SavedSetting) => s.id !== settingId);
    localStorage.setItem('charlies-odds-saved-settings', JSON.stringify(filteredSettings));
    loadSavedSettings();
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(savedSettings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentGame}-settings-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedSettings = JSON.parse(e.target?.result as string);
        const allSettings = JSON.parse(localStorage.getItem('charlies-odds-saved-settings') || '[]');
        
        // Add imported settings with new IDs to avoid conflicts
        const newSettings = importedSettings.map((setting: SavedSetting) => ({
          ...setting,
          id: `${currentGame}-imported-${Date.now()}-${Math.random()}`,
          name: `${setting.name} (Imported)`,
          createdAt: new Date().toISOString(),
        }));

        allSettings.push(...newSettings);
        localStorage.setItem('charlies-odds-saved-settings', JSON.stringify(allSettings));
        loadSavedSettings();
      } catch (error) {
        alert('Invalid settings file format');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const getSettingPreview = (settings: any) => {
    const preview = [];
    if (settings.betAmount) preview.push(`Bet: $${settings.betAmount}`);
    if (settings.multiplier) preview.push(`${settings.multiplier}x`);
    if (settings.strategy) preview.push(settings.strategy);
    if (settings.infiniteBet) preview.push('Infinite');
    return preview.slice(0, 3).join(', ');
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white flex items-center">
          <Settings className="w-5 h-5 mr-2" />
          Settings Manager
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSaveForm(!showSaveForm)}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center"
          >
            <Save className="w-4 h-4 mr-1" />
            Save Current
          </button>
          <button
            onClick={() => setShowManager(!showManager)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center"
          >
            {showManager ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
            {showManager ? 'Hide' : 'Manage'}
          </button>
        </div>
      </div>

      {/* Save New Setting Form */}
      {showSaveForm && (
        <div className="bg-gray-700 rounded-lg p-4 mb-4">
          <h4 className="text-white font-medium mb-3">Save Current Settings</h4>
          <div className="flex space-x-2">
            <input
              type="text"
              value={newSettingName}
              onChange={(e) => setNewSettingName(e.target.value)}
              placeholder="Enter setting name..."
              className="flex-1 px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-400"
              onKeyPress={(e) => e.key === 'Enter' && saveNewSetting()}
            />
            <button
              onClick={saveNewSetting}
              disabled={!newSettingName.trim()}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => setShowSaveForm(false)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Settings Manager */}
      {showManager && (
        <div className="space-y-4">
          {/* Import/Export Controls */}
          <div className="flex items-center justify-between bg-gray-700 rounded-lg p-3">
            <span className="text-white text-sm font-medium">Backup & Restore</span>
            <div className="flex space-x-2">
              <button
                onClick={exportSettings}
                disabled={savedSettings.length === 0}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-3 py-1 rounded text-sm flex items-center"
              >
                <Download className="w-3 h-3 mr-1" />
                Export
              </button>
              <label className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm flex items-center cursor-pointer">
                <Upload className="w-3 h-3 mr-1" />
                Import
                <input
                  type="file"
                  accept=".json"
                  onChange={importSettings}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Saved Settings List */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {savedSettings.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Settings className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No saved settings for {currentGame}</p>
                <p className="text-sm">Save your current settings to get started</p>
              </div>
            ) : (
              savedSettings
                .sort((a, b) => new Date(b.lastUsed || b.createdAt).getTime() - new Date(a.lastUsed || a.createdAt).getTime())
                .map((setting) => (
                  <div key={setting.id} className="bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h5 className="text-white font-medium">{setting.name}</h5>
                          {setting.lastUsed && (
                            <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">
                              Recently Used
                            </span>
                          )}
                        </div>
                        <p className="text-gray-300 text-sm">{getSettingPreview(setting.settings)}</p>
                        <p className="text-gray-400 text-xs">
                          Created: {new Date(setting.createdAt).toLocaleDateString()}
                          {setting.lastUsed && (
                            <span className="ml-2">
                              Last used: {new Date(setting.lastUsed).toLocaleDateString()}
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => loadSetting(setting)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                        >
                          Load
                        </button>
                        <button
                          onClick={() => deleteSetting(setting.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>

          {savedSettings.length > 0 && (
            <div className="text-xs text-gray-400 text-center">
              {savedSettings.length} saved setting{savedSettings.length !== 1 ? 's' : ''} for {currentGame}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SettingsManager;