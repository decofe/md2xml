---
title: Example Protocol for Widget Communication
docName: draft-example-widget-protocol-00
category: std
ipr: trust200902
submissionType: IETF
consensus: true

author:
  - fullname: Alice Example
    email: alice@example.org
  - fullname: Bob Tester
    email: bob@test.example.com
---

## Abstract

This document defines a protocol for widget-to-gadget communication over
unreliable networks. It specifies message formats, error handling, and
security considerations for implementations.

## Status of This Memo

This Internet-Draft is submitted in full conformance with the provisions
of BCP 78 and BCP 79.

## Copyright Notice

Copyright (c) 2026 IETF Trust and the persons identified as the document
authors. All rights reserved.

## Table of Contents

1. [Introduction](#1-introduction)
2. [Requirements Language](#2-requirements-language)
3. [Terminology](#3-terminology)
4. [Protocol Overview](#4-protocol-overview)
5. [Message Format](#5-message-format)
6. [Error Handling](#6-error-handling)
7. [Security Considerations](#7-security-considerations)
8. [IANA Considerations](#8-iana-considerations)
9. [References](#9-references)
10. [Appendix A: Examples](#appendix-a-examples)
11. [Acknowledgements](#acknowledgements)

---

## 1. Introduction

Widget communication has become essential in modern distributed systems.
This specification defines how widgets exchange messages with gadgets
using the Frobnicator Protocol [RFC2119].

The protocol supports three modes of operation:

1. **Synchronous**: Request-response with blocking
2. **Asynchronous**: Fire-and-forget messaging
3. **Streaming**: Continuous data flow

### 1.1. Protocol Flow

The following diagram illustrates the basic protocol flow:

```
   Widget                                          Gadget
      │                                               │
      │  (1) INIT request                             │
      ├──────────────────────────────────────────────>│
      │                                               │
      │  (2) INIT-ACK response                        │
      │<──────────────────────────────────────────────┤
      │                                               │
      │  (3) DATA message                             │
      ├──────────────────────────────────────────────>│
      │                                               │
      │  (4) DATA-ACK with status                     │
      │<──────────────────────────────────────────────┤
      │                                               │
```

### 1.2. Design Goals

This protocol was designed with the following goals:

- Simplicity of implementation
- Low latency for time-sensitive applications
- Extensibility for future enhancements

---

## 2. Requirements Language

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT",
"SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and
"OPTIONAL" in this document are to be interpreted as described in
BCP 14 [RFC2119] [RFC8174] when, and only when, they appear in all
capitals, as shown here.

---

## 3. Terminology

**Widget**
: A software component that initiates communication. Widgets are
  responsible for constructing and sending protocol messages.

**Gadget**
: A software component that receives and processes widget messages.
  Gadgets MUST respond within the configured timeout period.

**Frobnicator**
: The underlying transport mechanism. Frobnicators handle message
  serialization and network transmission.

**Nonce**
: A unique identifier for each message exchange. Nonces prevent
  replay attacks and enable message correlation.

**Session Key**
: A temporary cryptographic key used for a single session. Session
  keys are derived using the key exchange mechanism in Section 7.

---

## 4. Protocol Overview

The Widget Protocol operates in three phases:

1. Connection establishment
2. Data exchange
3. Connection termination

### 4.1. Connection Establishment

Widgets initiate connections by sending an INIT message. The message
format is defined in Section 5.

### 4.2. Data Exchange

Once connected, widgets and gadgets exchange DATA messages. Each
message MUST include a sequence number for ordering.

### 4.3. 3D Rendering Mode

When operating in 3D rendering mode, additional constraints apply.
The framebuffer MUST be initialized before sending graphics data.

---

## 5. Message Format

All messages use the following structure:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `version` | uint8 | REQUIRED | Protocol version (currently 1) |
| `type` | uint8 | REQUIRED | Message type identifier |
| `length` | uint16 | REQUIRED | Total message length in bytes |
| `nonce` | bytes | REQUIRED | 16-byte unique identifier |
| `payload` | bytes | OPTIONAL | Message-specific data |

### 5.1. Message Types

The following message types are defined:

- `0x01`: INIT - Connection initialization
- `0x02`: INIT-ACK - Initialization acknowledgment
- `0x03`: DATA - Data transfer
- `0x04`: DATA-ACK - Data acknowledgment
- `0x05`: CLOSE - Connection termination

### 5.2. Payload Encoding

Payloads are encoded using the following rules:

```json
{
  "encoding": "base64url",
  "compression": "none",
  "encryption": "aes-256-gcm"
}
```

Example payload for a DATA message:

```json
{
  "sequence": 42,
  "timestamp": "2026-01-15T10:30:00Z",
  "content": "SGVsbG8gV29ybGQh"
}
```

---

## 6. Error Handling

Implementations MUST handle the following error conditions:

### 6.1. Timeout Errors

If no response is received within 30 seconds, the sender SHOULD
retry the message up to 3 times before failing.

### 6.2. Invalid Messages

Invalid messages MUST be rejected with an error code. The following
error codes are defined:

| Code | Name | Description |
|------|------|-------------|
| 100 | INVALID_VERSION | Unsupported protocol version |
| 101 | INVALID_TYPE | Unknown message type |
| 102 | INVALID_LENGTH | Message length mismatch |
| 103 | INVALID_NONCE | Nonce validation failed |
| 200 | TIMEOUT | Response timeout exceeded |
| 201 | REJECTED | Message rejected by recipient |

### 6.3. Recovery Procedures

When errors occur, implementations SHOULD follow these steps:

1. Log the error with full context
2. Notify the application layer
3. Attempt recovery if possible
4. Close the connection if recovery fails

---

## 7. Security Considerations

This section describes security considerations for implementations.

### 7.1. Authentication

All messages MUST be authenticated using HMAC-SHA256. The MAC
is computed over the entire message including headers.

### 7.2. Encryption

Message payloads SHOULD be encrypted using AES-256-GCM. The
initialization vector MUST be unique for each message.

### 7.3. Replay Protection

Implementations MUST track used nonces and reject duplicates.
Nonces SHOULD be valid for no more than 5 minutes.

### 7.4. Key Management

Session keys MUST be rotated at least every 24 hours. Key
material MUST NOT be logged or persisted in plaintext.

### 7.5. 3D Secure Integration

When used with 3D Secure systems, additional authentication
steps are required as specified in [Widget3D].

---

## 8. IANA Considerations

### 8.1. Message Type Registry

This specification requests creation of a "Widget Protocol Message
Types" registry with the following initial values:

| Value | Name | Reference |
|-------|------|-----------|
| 0x01 | INIT | This document |
| 0x02 | INIT-ACK | This document |
| 0x03 | DATA | This document |
| 0x04 | DATA-ACK | This document |
| 0x05 | CLOSE | This document |

### 8.2. Error Code Registry

This specification requests creation of a "Widget Protocol Error
Codes" registry. Registration policy: Specification Required.

---

## 9. References

### 9.1. Normative References

**[RFC2119]**
: Bradner, S., "Key words for use in RFCs to Indicate Requirement
  Levels", BCP 14, RFC 2119, March 1997.

**[RFC8174]**
: Leiba, B., "Ambiguity of Uppercase vs Lowercase in RFC 2119 Key
  Words", BCP 14, RFC 8174, May 2017.

### 9.2. Informative References

**[Widget3D]**
: Example Corp., "3D Secure Widget Integration Guide",
  https://example.org/widget3d, 2025.

---

## Appendix A: Examples

This appendix provides example message exchanges.

### A.1. Basic Exchange

The following shows a complete message exchange:

```
   Widget                        Gadget
      │                             │
      │  (1) INIT                   │
      │  version=1, nonce=abc123    │
      ├────────────────────────────>│
      │                             │
      │  (2) INIT-ACK               │
      │  nonce=abc123, status=ok    │
      │<────────────────────────────┤
      │                             │
      │  (3) DATA seq=1             │
      │  payload="Hello"            │
      ├────────────────────────────>│
      │                             │
      │  (4) DATA-ACK seq=1         │
      │<────────────────────────────┤
      │                             │
```

### A.2. Error Recovery

When an error occurs, the exchange looks like:

```http
Widget -> Gadget: DATA seq=5
Gadget -> Widget: ERROR code=200 (timeout)
Widget -> Gadget: DATA seq=5 (retry 1)
Gadget -> Widget: DATA-ACK seq=5
```

### A.3. JSON Message Example

Complete INIT message in JSON format:

```json
{
  "version": 1,
  "type": 1,
  "length": 48,
  "nonce": "YWJjZGVmZ2hpamtsbW5vcA==",
  "payload": {
    "capabilities": ["streaming", "compression"],
    "maxMessageSize": 65536
  }
}
```

---

## Acknowledgements

The authors thank the Widget Working Group for their valuable feedback,
especially Charlie Delta for the security review and Dana Echo for
the implementation testing.
