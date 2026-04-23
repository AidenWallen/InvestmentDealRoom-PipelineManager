package com.skillstorm.investment_deal_room_backend.enums;

public enum PipelineStage {
    PROSPECTING("Prospecting", false),
    DUE_DILIGENCE("Due Diligence", false),
    NEGOTIATION("Negotiation", false),
    CLOSING("Closing", false),
    CLOSED_WON("Closed Won", true),
    CLOSED_LOST("Closed Lost", true);
 
    private final String displayName;
    private final boolean terminal;
 
    PipelineStage(String displayName, boolean terminal) {
        this.displayName = displayName;
        this.terminal = terminal;
    }

    public String getDisplayName() {
        return displayName;
    }

    public boolean isTerminal() {
        return terminal;
    }
 
}
