package com.skillstorm.investment_deal_room_backend.enums;

public enum ActivityType {
    DEAL_CREATED("created this deal"),
    DEAL_UPDATED("updated deal details"),
    STAGE_ADVANCED("advanced the stage"),
    STAGE_REVERTED("reverted the stage"),
    COUNTERPARTY_LINKED("linked a counterparty"),
    COUNTERPARTY_UNLINKED("removed a counterparty"),
    DEAL_DELETED("deleted this deal");

    private final String description;

    ActivityType(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

}
