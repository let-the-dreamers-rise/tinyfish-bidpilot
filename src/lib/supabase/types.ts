export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          team_id: string | null;
          role: "admin" | "operator" | "viewer";
          onboarded: boolean;
          portals_used: string[];
          packets_per_month: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          team_id?: string | null;
          role?: "admin" | "operator" | "viewer";
          onboarded?: boolean;
          portals_used?: string[];
          packets_per_month?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          team_id?: string | null;
          role?: "admin" | "operator" | "viewer";
          onboarded?: boolean;
          portals_used?: string[];
          packets_per_month?: number | null;
          updated_at?: string;
        };
      };
      teams: {
        Row: {
          id: string;
          name: string;
          plan: "starter" | "pro" | "enterprise";
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          plan?: "starter" | "pro" | "enterprise";
          created_at?: string;
        };
        Update: {
          name?: string;
          plan?: "starter" | "pro" | "enterprise";
        };
      };
      vendor_packets: {
        Row: {
          id: string;
          team_id: string;
          vendor_name: string;
          portal_url: string;
          portal_name: string | null;
          owner_name: string;
          status: "draft" | "ready" | "running" | "review" | "approved" | "blocked";
          progress: number;
          due_date: string | null;
          packet_id: string;
          summary: string | null;
          field_mappings: Json;
          checklist: Json;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          team_id: string;
          vendor_name: string;
          portal_url: string;
          portal_name?: string | null;
          owner_name: string;
          status?: "draft" | "ready" | "running" | "review" | "approved" | "blocked";
          progress?: number;
          due_date?: string | null;
          packet_id?: string;
          summary?: string | null;
          field_mappings?: Json;
          checklist?: Json;
          created_by?: string | null;
        };
        Update: {
          vendor_name?: string;
          portal_url?: string;
          portal_name?: string | null;
          owner_name?: string;
          status?: "draft" | "ready" | "running" | "review" | "approved" | "blocked";
          progress?: number;
          due_date?: string | null;
          summary?: string | null;
          field_mappings?: Json;
          checklist?: Json;
          updated_at?: string;
        };
      };
      documents: {
        Row: {
          id: string;
          packet_id: string;
          file_name: string;
          file_size: number | null;
          file_type: string | null;
          storage_path: string;
          status: "uploaded" | "attached" | "verified";
          uploaded_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          packet_id: string;
          file_name: string;
          file_size?: number | null;
          file_type?: string | null;
          storage_path: string;
          status?: "uploaded" | "attached" | "verified";
          uploaded_by?: string | null;
        };
        Update: {
          file_name?: string;
          status?: "uploaded" | "attached" | "verified";
        };
      };
      tinyfish_runs: {
        Row: {
          id: string;
          team_id: string;
          packet_id: string | null;
          tf_run_id: string | null;
          goal: string;
          url: string;
          safety_mode: string;
          browser_profile: string;
          status: string;
          steps: Json;
          result: Json;
          error_message: string | null;
          started_by: string | null;
          created_at: string;
          finished_at: string | null;
        };
        Insert: {
          id?: string;
          team_id: string;
          packet_id?: string | null;
          tf_run_id?: string | null;
          goal: string;
          url: string;
          safety_mode?: string;
          browser_profile?: string;
          status?: string;
          steps?: Json;
          result?: Json;
          error_message?: string | null;
          started_by?: string | null;
          finished_at?: string | null;
        };
        Update: {
          tf_run_id?: string | null;
          status?: string;
          steps?: Json;
          result?: Json;
          error_message?: string | null;
          finished_at?: string | null;
        };
      };
      audit_entries: {
        Row: {
          id: string;
          team_id: string;
          packet_id: string | null;
          run_id: string | null;
          action: string;
          detail: string | null;
          actor_id: string | null;
          actor_name: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          team_id: string;
          packet_id?: string | null;
          run_id?: string | null;
          action: string;
          detail?: string | null;
          actor_id?: string | null;
          actor_name?: string | null;
        };
        Update: never;
      };
      portal_intelligence: {
        Row: {
          id: string;
          portal_domain: string;
          portal_name: string | null;
          field_mappings: Json;
          quirks: Json;
          runs_completed: number;
          last_run_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          portal_domain: string;
          portal_name?: string | null;
          field_mappings?: Json;
          quirks?: Json;
          runs_completed?: number;
          last_run_at?: string | null;
        };
        Update: {
          portal_name?: string | null;
          field_mappings?: Json;
          quirks?: Json;
          runs_completed?: number;
          last_run_at?: string | null;
          updated_at?: string;
        };
      };
    };
  };
};

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Team = Database["public"]["Tables"]["teams"]["Row"];
export type VendorPacket = Database["public"]["Tables"]["vendor_packets"]["Row"];
export type Document = Database["public"]["Tables"]["documents"]["Row"];
export type TinyFishRunRecord = Database["public"]["Tables"]["tinyfish_runs"]["Row"];
export type AuditEntry = Database["public"]["Tables"]["audit_entries"]["Row"];
export type PortalIntelligence = Database["public"]["Tables"]["portal_intelligence"]["Row"];
