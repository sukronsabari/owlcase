"use client";

import { Truck } from "lucide-react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";

import { TrackingData } from "./type";

import "react-vertical-timeline-component/style.min.css";

export function TrackingList({
  trackingData,
}: {
  trackingData: TrackingData | null;
}) {
  return (
    <>
      {trackingData ? (
        <VerticalTimeline lineColor="#e2e8f0" layout="1-column-left">
          {trackingData?.history?.length
            ? trackingData.history.map((event, index) => (
                <VerticalTimelineElement
                  key={index}
                  className="vertical-timeline-element--work"
                  contentStyle={{
                    background: "white",
                    color: "#111827",
                    boxShadow: "none",
                    border: "1px solid #e2e8f0",
                  }}
                  contentArrowStyle={{ borderRight: "7px solid #e2e8f0" }}
                  iconStyle={{
                    background: "#0d9488",
                    color: "#fff",
                  }}
                  icon={<Truck className="w-2 h-2" />}
                  position="right"
                  visible
                >
                  <h3 className="vertical-timeline-element-title text-sm uppercase">
                    {event.status}
                  </h3>
                  <h4 className="vertical-timeline-element-subtitle text-xs">
                    {new Date(event.updated_at).toLocaleDateString()}
                  </h4>
                  <p>{event.note}</p>
                </VerticalTimelineElement>
              ))
            : null}
        </VerticalTimeline>
      ) : (
        <p>Belum ada perjalanan paket</p>
      )}
    </>
  );
}
