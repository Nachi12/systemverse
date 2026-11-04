import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { CpuRamSsdDemo } from "../components/demonstrations/CpuRamSsdDemo";
import { DatabaseScalingDemo } from "../components/demonstrations/DatabaseScalingDemo";
import { HldVsLldDemo } from "../components/demonstrations/HldVsLldDemo";

describe("Interactive Demonstrations", () => {
  it("renders the CPU/RAM/SSD demo and detects swapping on dataset overflow", () => {
    render(<CpuRamSsdDemo />);
    expect(screen.getByText("CPU, RAM & SSD Bottleneck Visualizer")).toBeInTheDocument();
    expect(screen.getByText("RAM is healthy. All active data fits in fast working memory (~8ms latency).")).toBeInTheDocument();

    // Trigger dataset size to 10GB while RAM is 4GB (via slider event)
    const sliders = screen.getAllByRole("slider");
    const datasetSlider = sliders[1]; // second slider is dataset
    fireEvent.change(datasetSlider, { target: { value: "10" } });

    expect(screen.getByText(/CRITICAL BOTTLENECK: Disk Swapping Activated!/i)).toBeInTheDocument();
  });

  it("steps through Database Scaling stages correctly", () => {
    render(<DatabaseScalingDemo />);
    expect(screen.getByText("Stage 1: Single App + Single Database (No Indexes)")).toBeInTheDocument();

    const nextBtn = screen.getByText("Next Stage");
    fireEvent.click(nextBtn);

    expect(screen.getByText("Stage 2: Query Tuning & B-Tree Indexes")).toBeInTheDocument();
    expect(screen.getByText(/Eliminates O\(N\) full disk scans/i)).toBeInTheDocument();
  });

  it("toggles between HLD and LLD views", () => {
    render(<HldVsLldDemo />);
    expect(screen.getByText("Component & Data Pipeline Topology")).toBeInTheDocument();

    const lldBtn = screen.getByText("Low-Level Design (LLD)");
    fireEvent.click(lldBtn);

    expect(screen.getByText("Classes & Interfaces")).toBeInTheDocument();
    expect(screen.getByText(/interface PaymentGatewayInterface/i)).toBeInTheDocument();
  });
});

