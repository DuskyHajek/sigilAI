import React, { useState } from "react";
import {
  Database,
  AppWindow,
  Bot,
  ShieldAlert,
  Rocket,
  Dna,
  Fingerprint,
  Server,
  Layers,
  Cpu,
  Globe,
  Activity,
  Lock,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { THEMES } from "@config/thesis.js";

const ICON_MAP = {
  server: Server,
  layers: Layers,
  cpu: Cpu,
  shield: ShieldAlert,
  globe: Globe,
  activity: Activity,
  lock: Lock,
  database: Database,
  appwindow: AppWindow,
  bot: Bot,
  rocket: Rocket,
  dna: Dna,
  fingerprint: Fingerprint,
};

const ThemePulse = ({ themeData }) => {
  const [expandedTheme, setExpandedTheme] = useState(null);

  if (!themeData) return null;

  return (
    <div className="glass-panel border-gold-glow p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sigil-gold inline-block animate-pulse"></span>
            Theme Pulse Heatmap
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Live thesis evaluation of news signals across the 7 Sigil sectors
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
        {THEMES.map((theme) => {
          const data = themeData[theme.id] || {
            activity_score: 1,
            thesis_score: 0,
            reason: "No updates detected.",
          };
          const IconComponent = ICON_MAP[theme.icon] || Database;
          const isExpanded = expandedTheme === theme.id;

          let sentimentColorClass = "text-slate-400";
          let sentimentBgClass = "bg-slate-900/40 border-slate-800";
          let glowColor = "rgba(100, 116, 139, 0.15)";
          let SentimentIcon = Minus;

          if (data.thesis_score >= 2) {
            sentimentColorClass = "text-bullish";
            sentimentBgClass = "bg-bullish/5 border-bullish/30";
            glowColor = `rgba(16, 185, 129, ${0.05 + data.activity_score / 20})`;
            SentimentIcon = TrendingUp;
          } else if (data.thesis_score <= -2) {
            sentimentColorClass = "text-bearish";
            sentimentBgClass = "bg-bearish/5 border-bearish/30";
            glowColor = `rgba(244, 63, 94, ${0.05 + data.activity_score / 20})`;
            SentimentIcon = TrendingDown;
          }

          const pulseStyle = {
            "--pulse-color": glowColor,
            borderColor:
              data.thesis_score >= 2
                ? `rgba(16, 185, 129, ${0.1 + data.activity_score / 15})`
                : data.thesis_score <= -2
                  ? `rgba(244, 63, 94, ${0.1 + data.activity_score / 15})`
                  : theme.color_hex + "33",
            boxShadow: `0 0 ${8 + data.activity_score * 2}px ${glowColor}`,
          };

          return (
            <div
              key={theme.id}
              style={pulseStyle}
              onClick={() =>
                setExpandedTheme(isExpanded ? null : theme.id)
              }
              className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                isExpanded
                  ? "bg-slate-900/60"
                  : "bg-slate-950/40 hover:bg-slate-900/30"
              } flex flex-col`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg bg-slate-900 border border-slate-800 ${sentimentColorClass}`}
                    style={{ color: theme.color_hex }}
                  >
                    <IconComponent size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-200">
                      {theme.display_name}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {theme.short_description.substring(0, 50)}...
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                      Activity
                    </span>
                    <div className="flex items-center gap-1 mt-0.5">
                      <div className="h-1.5 w-12 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${data.activity_score * 10}%`,
                            backgroundColor: theme.color_hex,
                          }}
                        ></div>
                      </div>
                      <span
                        className="text-xs font-mono font-bold ml-1"
                        style={{ color: theme.color_hex }}
                      >
                        {data.activity_score}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`px-2 py-1 rounded border flex items-center gap-1 ${sentimentBgClass}`}
                  >
                    <SentimentIcon
                      size={12}
                      className={sentimentColorClass}
                    />
                    <span
                      className={`text-xs font-mono font-bold ${sentimentColorClass}`}
                    >
                      {data.thesis_score > 0
                        ? `+${data.thesis_score}`
                        : data.thesis_score}
                    </span>
                  </div>
                </div>
              </div>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  isExpanded
                    ? "max-h-40 mt-3 pt-3 border-t border-slate-900"
                    : "max-h-0"
                }`}
              >
                <div className="text-xs space-y-2">
                  <p className="text-slate-400 font-mono text-[11px] leading-relaxed">
                    <span className="text-sigil-gold font-bold">ANALYSIS: </span>
                    {data.reason}
                  </p>
                  <p className="text-[10px] text-slate-500 font-sans italic">
                    {theme.short_description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ThemePulse;
