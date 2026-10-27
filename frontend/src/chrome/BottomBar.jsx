import { useTranslation } from "../i18n/useTranslation";
import "./BottomBar.css";

export function BottomBar({ screen, go }) {
  const { t } = useTranslation();

  const current = (screen ?? "").split(":")[0];

  const items = [
    { key: "overview", icon: "🏰", label: t("menu.overview"), href: "#overview" },
    { key: "map", icon: "🗺️", label: t("map.title"), href: "#map" },
    { key: "place", icon: "⚔️", label: t("overview.place"), href: "#place" },
    { key: "report", icon: "📜", label: t("menu.reports"), href: "#report" },
    { key: "mail", icon: "✉️", label: t("menu.messages"), href: "#mail" },
  ];

  const handleClick = (e, target) => {
    e.preventDefault();
    go?.(e, target.key);
    window.location.hash = target.href;
  };

  return (
    <nav className="tw-bottom-dock" aria-label="Mobile Navigation">
      {items.map((item) => {
        const isActive =
          current === item.key ||
          (item.key === "report" && (current === "reports" || current === "report")) ||
          (item.key === "mail" && current === "messages");

        return (
          <a
            key={item.key}
            href={item.href}
            className={`tw-bottom-item ${isActive ? "active" : ""}`}
            onClick={(e) => handleClick(e, item)}
          >
            <span className="tw-bottom-icon">{item.icon}</span>
            <span className="tw-bottom-label">{item.label}</span>
          </a>
        );
      })}
    </nav>
  );
}
