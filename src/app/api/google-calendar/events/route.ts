import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
  location?: string;
  htmlLink?: string;
}

interface TransformedEvent {
  id: string;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  location: string | null;
  htmlLink: string | null;
  source: "google_calendar";
}

/**
 * GET /api/google-calendar/events - Get events from Google Calendar
 * Public endpoint - returns events from Google Calendar
 */
export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
    const calendarId = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID;

    if (!apiKey || !calendarId) {
      // Return empty array if Google Calendar is not configured
      return NextResponse.json({ events: [] });
    }

    const { searchParams } = new URL(request.url);
    const timeMin = searchParams.get("timeMin");
    const timeMax = searchParams.get("timeMax");
    const maxResults = parseInt(searchParams.get("maxResults") || "100");

    // Build Google Calendar API URL
    const baseUrl = "https://www.googleapis.com/calendar/v3/calendars";
    const encodedCalendarId = encodeURIComponent(calendarId);
    const url = new URL(`${baseUrl}/${encodedCalendarId}/events`);

    url.searchParams.set("key", apiKey);
    url.searchParams.set("singleEvents", "true");
    url.searchParams.set("orderBy", "startTime");
    url.searchParams.set("maxResults", maxResults.toString());

    // Set time range
    if (timeMin) {
      url.searchParams.set("timeMin", timeMin);
    } else {
      // Default to current time
      url.searchParams.set("timeMin", new Date().toISOString());
    }

    if (timeMax) {
      url.searchParams.set("timeMax", timeMax);
    }

    const response = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Google Calendar API error:", response.status, errorText);
      // Return empty array on error instead of failing
      return NextResponse.json({ events: [] });
    }

    const data = await response.json();

    // Transform Google Calendar events to our format
    const transformedEvents: TransformedEvent[] = (data.items || []).map(
      (event: GoogleCalendarEvent) => {
        // Get start date
        const startDate = event.start.dateTime || event.start.date;
        if (!startDate) {
          return null;
        }

        // Get end date
        const endDate = event.end?.dateTime || event.end?.date || null;

        return {
          id: `google_${event.id}`,
          title: event.summary || "Без названия",
          description: event.description || null,
          start_date: startDate,
          end_date: endDate,
          location: event.location || null,
          htmlLink: event.htmlLink || null,
          source: "google_calendar",
        };
      }
    ).filter((event: TransformedEvent | null) => event !== null);

    return NextResponse.json({ events: transformedEvents });
  } catch (error) {
    console.error("Error fetching Google Calendar events:", error);
    // Return empty array on error instead of failing
    return NextResponse.json({ events: [] });
  }
}

