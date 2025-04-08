"use client";

import React from "react";
import styled from "@emotion/styled";

const TermTemplate = async ({ contentHtml, links }: any) => {
  return (
    <TermContainer>
      <div className="inner">
        <div
          className="term-container"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        {links.length > 0 && (
          <div className="term-links">
            <div className="title">
              <h2>Other Terms</h2>
            </div>
            <div>{links}</div>
          </div>
        )}
      </div>
    </TermContainer>
  );
};

export default TermTemplate;

const TermContainer = styled.div`
  width: 100%;
  height: 100%;
  .inner {
    width: 100%;
    height: 100%;
    max-width: 640px;
    padding: 32px 20px;
    margin: 0 auto;
  }

  .term-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;

    h1 {
      font-size: 24px;
      font-weight: 700;
      line-height: 100%;
    }
    h2 {
      font-size: 20px;
      font-weight: 700;
      line-height: 100%;
    }
    h3 {
      font-size: 16px;
      font-weight: 700;
      line-height: 100%;
    }

    ol {
      padding-left: 20px;
      list-style-type: decimal;
      li {
        margin-bottom: 10px;
      }
    }
  }

  .term-links {
    margin-top: 60px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    .title {
      margin-bottom: 20px;
    }
  }
`;
