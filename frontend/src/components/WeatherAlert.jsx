import React from 'react';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

const WeatherAlert = ({ alerts = [], compact = false }) => {
  if (!alerts || alerts.length === 0) {
    return null;
  }

  const getAlertIcon = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'severe':
      case 'high':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'moderate':
      case 'medium':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getAlertColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'severe':
      case 'high':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'moderate':
      case 'medium':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  if (compact) {
    return (
      <div className="space-y-2">
        {alerts.slice(0, 2).map((alert, index) => (
          <div
            key={index}
            className={`flex items-start gap-2 p-2 rounded border ${getAlertColor(alert.severity)}`}
          >
            {getAlertIcon(alert.severity)}
            <p className="text-sm font-medium flex-1">{alert.message || alert.title}</p>
          </div>
        ))}
        {alerts.length > 2 && (
          <p className="text-xs text-gray-500 text-center">
            +{alerts.length - 2} more alerts
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-orange-500" />
        Weather Alerts
      </h3>
      <div className="space-y-2">
        {alerts.map((alert, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${getAlertColor(alert.severity)}`}
          >
            <div className="flex items-start gap-3">
              {getAlertIcon(alert.severity)}
              <div className="flex-1">
                <h4 className="font-semibold mb-1">{alert.title || alert.alert_type}</h4>
                {alert.message && (
                  <p className="text-sm mb-2">{alert.message}</p>
                )}
                {alert.description && (
                  <p className="text-sm">{alert.description}</p>
                )}
                {alert.recommendations && alert.recommendations.length > 0 && (
                  <ul className="mt-2 space-y-1 text-sm">
                    {alert.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-gray-600">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherAlert;
